const mongoose = require('mongoose')

const DEFAULT_RETRY_DELAY_MS = Number(process.env.MONGODB_RETRY_DELAY_MS || 5000)
const DEFAULT_MAX_RETRIES = Number(process.env.MONGODB_MAX_RETRIES || 0)

let listenersAttached = false

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

const buildConnectionHints = (uri, error) => {
  const hints = []
  const message = error?.message || ''

  if (uri?.includes('localhost')) {
    hints.push(
      'Detected `localhost` in MONGODB_URI. On Windows this can resolve to `::1`; prefer `127.0.0.1`.',
    )
  }

  if (message.includes('ECONNREFUSED')) {
    hints.push('MongoDB is not accepting TCP connections at the configured host/port.')
    hints.push('If you are running locally, verify the MongoDB service is started.')
    hints.push('If local MongoDB is unavailable, switch MONGODB_URI to a MongoDB Atlas connection string.')
  }

  if (message.includes('27017')) {
    hints.push('Confirmed expected MongoDB port is 27017. Ensure nothing else is blocking that port.')
  }

  return hints
}

const attachConnectionListeners = () => {
  if (listenersAttached) {
    return
  }

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}`)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. The app will retry on the next connection attempt.')
  })

  mongoose.connection.on('error', (error) => {
    console.error(`MongoDB connection event error: ${error.message}`)
  })

  listenersAttached = true
}

const connectDB = async ({
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
} = {}) => {
  const rawUri = process.env.MONGODB_URI
  const uri = normalizeMongoUri(rawUri)
  let attempt = 0

  if (!rawUri) {
    throw new Error('MONGODB_URI is not defined in the environment')
  }

  if (uri !== rawUri) {
    console.warn('Normalized MongoDB URI from `localhost` to `127.0.0.1` for IPv4 compatibility.')
  }

  attachConnectionListeners()

  while (maxRetries === 0 || attempt < maxRetries) {
    attempt += 1

    try {
      console.log(`Attempting MongoDB connection (attempt ${attempt})...`)

      await mongoose.connect(uri, {
        autoIndex: process.env.NODE_ENV !== 'production',
        family: 4,
        serverSelectionTimeoutMS: 5000,
      })

      return mongoose.connection
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`)

      const hints = buildConnectionHints(rawUri, error)
      hints.forEach((hint) => console.error(`MongoDB hint: ${hint}`))

      if (maxRetries !== 0 && attempt >= maxRetries) {
        throw new Error(
          `Unable to connect to MongoDB after ${attempt} attempt(s). Check your MONGODB_URI and MongoDB availability.`,
        )
      }

      console.log(`Retrying MongoDB connection in ${retryDelayMs}ms...`)
      await wait(retryDelayMs)
    }
  }

  return mongoose.connection
}

module.exports = connectDB
