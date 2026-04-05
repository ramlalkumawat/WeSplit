const { getDatabaseUnavailableDetails, isDatabaseReady } = require('../config/database')
const AppError = require('../utils/appError')

const requireDatabaseConnection = (req, res, next) => {
  if (isDatabaseReady()) {
    return next()
  }

  return next(
    new AppError('Database is temporarily unavailable. Please try again shortly.', 503, {
      database: getDatabaseUnavailableDetails(),
      retryable: true,
    }),
  )
}

module.exports = requireDatabaseConnection
