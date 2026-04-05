const mongoose = require('mongoose')

const DEFAULT_RETRY_DELAY_MS = Number(process.env.MONGODB_RETRY_DELAY_MS || 5000)
const DEFAULT_MAX_RETRIES = Number(process.env.MONGODB_MAX_RETRIES || 0)
const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = Number(
  process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000,
)

const READY_STATE_LABELS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

const connectionStatus = {
  attempts: 0,
  connected: false,
  lastAttemptAt: null,
  lastConnectedAt: null,
  lastError: null,
  nextRetryAt: null,
  readyState: READY_STATE_LABELS[mongoose.connection.readyState] || 'unknown',
  state: 'idle',
  uri: null,
}

let listenersAttached = false
let connectionPromise = null
let reconnectTimer = null

mongoose.set('strictQuery', true)
mongoose.set('sanitizeFilter', true)
mongoose.set('bufferCommands', false)

const wait = (durationMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs)
  })

const normalizeMongoUri = (uri) => {
  if (!uri) {
    return uri
  }

  return uri.replace('mongodb://localhost:', 'mongodb://127.0.0.1:')
}

const sanitizeMongoUri = (uri) => {
  if (!uri) {
    return null
  }

  return uri.replace(
    /(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/i,
    (match, prefix, _password, suffix) => `${prefix}****${suffix}`,
  )
}

const formatConnectionError = (error) => {
  if (!error) {
    return null
  }

  return {
    message: error.message || 'Unknown MongoDB connection error',
    name: error.name || 'Error',
  }
}

const setConnectionStatus = (updates = {}) => {
  Object.assign(connectionStatus, updates, {
    connected: mongoose.connection.readyState === 1,
    readyState: READY_STATE_LABELS[mongoose.connection.readyState] || 'unknown',
  })
}

const clearReconnectTimer = () => {
  if (!reconnectTimer) {
    return
  }

  clearTimeout(reconnectTimer)
  reconnectTimer = null
}

const getDatabaseStatus = () => ({
  attempts: connectionStatus.attempts,
  connected: mongoose.connection.readyState === 1,
  lastAttemptAt: connectionStatus.lastAttemptAt,
  lastConnectedAt: connectionStatus.lastConnectedAt,
  lastError: connectionStatus.lastError,
  nextRetryAt: connectionStatus.nextRetryAt,
  readyState: READY_STATE_LABELS[mongoose.connection.readyState] || 'unknown',
  state: connectionStatus.state,
  uri: connectionStatus.uri,
})

const getDatabaseUnavailableDetails = () => {
  const status = getDatabaseStatus()

  return {
    attempts: status.attempts,
    lastAttemptAt: status.lastAttemptAt,
    lastError: status.lastError?.message || null,
    nextRetryAt: status.nextRetryAt,
    state: status.state,
  }
}

const isDatabaseReady = () => mongoose.connection.readyState === 1

const resolveMongoUri = () => {
  const primaryUri = normalizeMongoUri(process.env.MONGODB_URI)
  const fallbackUri = normalizeMongoUri(
    process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI_NON_SRV,
  )
  const lastErrorMessage = connectionStatus.lastError?.message || ''
  const shouldPreferFallback = /querysrv|dns|srv|enotfound|etimeout/i.test(lastErrorMessage)

  if (shouldPreferFallback && fallbackUri) {
    return {
      source: 'fallback',
      uri: fallbackUri,
    }
  }

  if (primaryUri) {
    return {
      source: 'primary',
      uri: primaryUri,
    }
  }

  if (fallbackUri) {
    return {
      source: 'fallback',
      uri: fallbackUri,
    }
  }

  return {
    source: 'missing',
    uri: null,
  }
}

const buildConnectionHints = (uri, error, source) => {
  const hints = []
  const message = error?.message || ''
  const normalizedMessage = message.toLowerCase()
  const hasSrvLookupError = normalizedMessage.includes('querysrv') || normalizedMessage.includes('dns')

  if (uri?.includes('localhost')) {
    hints.push(
      'Detected `localhost` in the MongoDB URI. On Windows this can resolve to `::1`; prefer `127.0.0.1`.',
    )
  }

  if (hasSrvLookupError) {
    hints.push(
      'Atlas SRV DNS lookup failed. If this persists, copy the Atlas "Standard connection string" into `MONGODB_DIRECT_URI` and restart.',
    )
  }

  if (normalizedMessage.includes('etimeout') || normalizedMessage.includes('server selection')) {
    hints.push('The MongoDB server could not be reached in time. Check local DNS, firewall, and VPN settings.')
    hints.push('For development, ensure MongoDB Atlas IP Access List includes `0.0.0.0/0`.')
  }

  if (normalizedMessage.includes('econnrefused') && !hasSrvLookupError) {
    hints.push('MongoDB is refusing TCP connections at the configured host and port.')
    hints.push('If using a local MongoDB instance, verify the service is running.')
  }

  if (source === 'primary' && process.env.MONGODB_DIRECT_URI) {
    hints.push(
      'A non-SRV fallback is configured in `MONGODB_DIRECT_URI` and will be preferred after DNS-related failures.',
    )
  }

  return hints
}

const scheduleReconnect = (reason, retryDelayMs = DEFAULT_RETRY_DELAY_MS) => {
  if (connectionPromise || reconnectTimer || isDatabaseReady()) {
    return
  }

  const nextRetryAt = new Date(Date.now() + retryDelayMs).toISOString()
  setConnectionStatus({
    nextRetryAt,
  })

  console.log(`Scheduling MongoDB reconnect in ${retryDelayMs}ms (${reason}).`)

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null

    void connectDB({ retryDelayMs }).catch((error) => {
      console.error(`MongoDB reconnect loop stopped: ${error.message}`)
    })
  }, retryDelayMs)
}

const attachConnectionListeners = () => {
  if (listenersAttached) {
    return
  }

  mongoose.connection.on('connecting', () => {
    setConnectionStatus({
      state: 'connecting',
    })
    console.log('MongoDB connection state changed to connecting.')
  })

  mongoose.connection.on('connected', () => {
    clearReconnectTimer()
    setConnectionStatus({
      lastConnectedAt: new Date().toISOString(),
      lastError: null,
      nextRetryAt: null,
      state: 'connected',
    })
    console.log(
      `MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name || 'default'}`,
    )
  })

  mongoose.connection.on('disconnected', () => {
    setConnectionStatus({
      state: 'disconnected',
    })
    console.warn(
      'MongoDB disconnected. The API will keep serving HTTP requests and continue retrying in the background.',
    )
    scheduleReconnect('disconnect event')
  })

  mongoose.connection.on('error', (error) => {
    setConnectionStatus({
      lastError: formatConnectionError(error),
      state: 'error',
    })
    console.error(`MongoDB connection event error: ${error.message}`)
  })

  listenersAttached = true
}

const connectDB = async ({
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  serverSelectionTimeoutMS = DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
} = {}) => {
  attachConnectionListeners()

  if (isDatabaseReady()) {
    return mongoose.connection
  }

  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = (async () => {
    let attempt = 0

    while (maxRetries === 0 || attempt < maxRetries) {
      const { source, uri } = resolveMongoUri()

      if (!uri) {
        setConnectionStatus({
          lastError: {
            message:
              'MONGODB_URI is not configured. Set MONGODB_URI or MONGODB_DIRECT_URI to enable database-backed routes.',
            name: 'ConfigurationError',
          },
          nextRetryAt: null,
          state: 'misconfigured',
          uri: null,
        })
        console.error(connectionStatus.lastError.message)
        return null
      }

      attempt += 1
      setConnectionStatus({
        attempts: attempt,
        lastAttemptAt: new Date().toISOString(),
        nextRetryAt: null,
        state: 'connecting',
        uri: sanitizeMongoUri(uri),
      })

      try {
        console.log(
          `Attempting MongoDB connection (attempt ${attempt}, ${source === 'fallback' ? 'non-SRV fallback' : 'primary'} URI): ${sanitizeMongoUri(uri)}`,
        )

        await mongoose.connect(uri, {
          autoIndex: process.env.NODE_ENV !== 'production',
          family: 4,
          serverSelectionTimeoutMS,
        })

        return mongoose.connection
      } catch (error) {
        setConnectionStatus({
          lastError: formatConnectionError(error),
          state: 'error',
        })

        console.error(
          `MongoDB connection attempt ${attempt} failed: ${error.name || 'Error'}: ${error.message}`,
        )

        const hints = buildConnectionHints(uri, error, source)
        hints.forEach((hint) => console.error(`MongoDB hint: ${hint}`))

        if (maxRetries !== 0 && attempt >= maxRetries) {
          throw new Error(
            `Unable to connect to MongoDB after ${attempt} attempt(s). Check your MongoDB URI, Atlas network access list, and DNS configuration.`,
          )
        }

        const nextRetryAt = new Date(Date.now() + retryDelayMs).toISOString()
        setConnectionStatus({
          nextRetryAt,
        })

        console.log(`Retrying MongoDB connection in ${retryDelayMs}ms...`)
        await wait(retryDelayMs)
      }
    }

    return mongoose.connection
  })()

  try {
    return await connectionPromise
  } finally {
    connectionPromise = null
  }
}

module.exports = {
  connectDB,
  getDatabaseStatus,
  getDatabaseUnavailableDetails,
  isDatabaseReady,
}
