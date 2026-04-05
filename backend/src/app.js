const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const { getDatabaseStatus } = require('./config/database')
const groupRoutes = require('./routes/groupRoutes')
const errorHandler = require('./middleware/errorHandler')
const securityHeaders = require('./middleware/securityHeaders')

const app = express()
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist')
const frontendIndexPath = path.join(frontendDistPath, 'index.html')
const shouldServeFrontend =
  process.env.NODE_ENV === 'production' && fs.existsSync(frontendIndexPath)

const allowedOrigins = (process.env.CLIENT_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.use(securityHeaders)

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      const corsError = new Error('Origin not allowed by CORS')
      corsError.statusCode = 403
      return callback(corsError)
    },
  }),
)
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  const database = getDatabaseStatus()

  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      database: {
        connected: database.connected,
        lastAttemptAt: database.lastAttemptAt,
        lastConnectedAt: database.lastConnectedAt,
        lastError: database.lastError?.message || null,
        nextRetryAt: database.nextRetryAt,
        readyState: database.readyState,
        state: database.state,
      },
      port: Number(process.env.PORT || 5000),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

if (shouldServeFrontend) {
  app.use(express.static(frontendDistPath))

  app.get('*', (req, res) => {
    res.sendFile(frontendIndexPath)
  })
} else {
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    })
  })
}

app.use(errorHandler)

module.exports = app
