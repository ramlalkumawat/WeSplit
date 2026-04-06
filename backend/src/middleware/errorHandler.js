const { getDatabaseUnavailableDetails } = require('../config/database')
const { nodeEnv } = require('../config/env')

const isDatabaseConnectivityError = (err) => {
  const message = err?.message || ''

  return (
    err?.name === 'MongooseServerSelectionError' ||
    err?.name === 'MongoServerSelectionError' ||
    err?.name === 'MongoNetworkError' ||
    err?.name === 'MongoTopologyClosedError' ||
    err?.name === 'MongoNotConnectedError' ||
    message.includes('bufferCommands = false') ||
    message.includes('buffering timed out') ||
    message.includes('querySrv') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ETIMEOUT') ||
    message.includes('Server selection timed out')
  )
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  let details = err.details || null

  if (isDatabaseConnectivityError(err)) {
    statusCode = 503
    message = 'Database is temporarily unavailable. Please try again shortly.'
    details = {
      database: getDatabaseUnavailableDetails(),
      retryable: true,
    }
  }

  if (err.name === 'CastError') {
    statusCode = 404
    message = 'Requested resource was not found'
  }

  if (err.code === 11000) {
    statusCode = 409
    message = 'A record with the same unique value already exists'
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
    details = {
      fields: Object.values(err.errors).map((value) => value.message),
    }
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Authentication token is invalid'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Authentication token has expired'
  }

  if (nodeEnv !== 'test') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${statusCode}`)
    console.error(err)
  }

  const response = {
    success: false,
    message,
  }

  if (details) {
    response.details = details
  }

  if (nodeEnv === 'development') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}

module.exports = errorHandler
