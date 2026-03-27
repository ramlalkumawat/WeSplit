const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  let details = err.details || null

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

  if (process.env.NODE_ENV !== 'test') {
    console.error(err)
  }

  const response = {
    success: false,
    message,
  }

  if (details) {
    response.details = details
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}

module.exports = errorHandler
