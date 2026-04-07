const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const { getDatabaseStatus } = require('./config/database')
const { nodeEnv, port } = require('./config/env')
const { allowedOrigins, isProduction, trustProxy } = require('./config/security')
const groupRoutes = require('./routes/groupRoutes')
const errorHandler = require('./middleware/errorHandler')
const securityHeaders = require('./middleware/securityHeaders')

const app = express()
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist')
const frontendIndexPath = path.join(frontendDistPath, 'index.html')
const shouldServeFrontend = isProduction && fs.existsSync(frontendIndexPath)
const corsAllowedHeaders = ['Authorization', 'Content-Type', 'X-CSRF-Token']
const corsAllowedMethods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

const buildRequestOrigin = (req) => {
  const hostHeader = req.get('host')

  if (!hostHeader) {
    return null
  }

  return `${req.protocol}://${hostHeader}`
}

const isApiRequest = (requestPath) => requestPath === '/api' || requestPath.startsWith('/api/')

const buildCorsOptions = (req) => {
  const origin = req.header('Origin')
  const requestOrigin = buildRequestOrigin(req)
  const requestAllowedOrigins = new Set(allowedOrigins)

  if (requestOrigin) {
    requestAllowedOrigins.add(requestOrigin)
  }

  const baseCorsOptions = {
    allowedHeaders: corsAllowedHeaders,
    credentials: true,
    methods: corsAllowedMethods,
    optionsSuccessStatus: 204,
  }

  if (!origin) {
    return {
      ...baseCorsOptions,
      origin: false,
    }
  }

  if ((!isProduction && requestAllowedOrigins.size === 0) || requestAllowedOrigins.has(origin)) {
    return {
      ...baseCorsOptions,
      origin,
    }
  }

  const corsError = new Error('Origin not allowed by CORS')
  corsError.statusCode = 403
  throw corsError
}

const corsOptionsDelegate = (req, callback) => {
  try {
    callback(null, buildCorsOptions(req))
  } catch (error) {
    callback(error)
  }
}

const createHealthPayload = () => {
  const database = getDatabaseStatus()

  return {
    database: {
      connected: database.connected,
      lastAttemptAt: database.lastAttemptAt,
      lastConnectedAt: database.lastConnectedAt,
      lastError: database.lastError?.message || null,
      nextRetryAt: database.nextRetryAt,
      readyState: database.readyState,
      state: database.state,
    },
    environment: nodeEnv,
    port,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
}

const sendOperationalResponse = (res, message) => {
  res.status(200).json({
    success: true,
    message,
    data: createHealthPayload(),
  })
}

app.disable('x-powered-by')
app.set('trust proxy', trustProxy)
app.use(securityHeaders)
app.use(cors(corsOptionsDelegate))
app.options('*', cors(corsOptionsDelegate))
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

app.get('/', (req, res) => {
  if (shouldServeFrontend) {
    return res.sendFile(frontendIndexPath)
  }

  return sendOperationalResponse(res, 'Wesplit API is running')
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: createHealthPayload(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

if (shouldServeFrontend) {
  app.use(express.static(frontendDistPath))
}

app.use((req, res) => {
  if (shouldServeFrontend && !isApiRequest(req.path) && ['GET', 'HEAD'].includes(req.method)) {
    return res.sendFile(frontendIndexPath)
  }

  if (isProduction) {
    return sendOperationalResponse(res, 'Wesplit service is live')
  }

  return res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use(errorHandler)

module.exports = app
