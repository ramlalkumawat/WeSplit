const AppError = require('../utils/appError')

const collectValidationErrors = (details) => details.map((detail) => detail.message)

const validateRequest = (schemas = {}) => (req, res, next) => {
  for (const [target, schema] of Object.entries(schemas)) {
    if (!schema) {
      continue
    }

    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      throw new AppError('Please review the submitted request data', 400, {
        fields: collectValidationErrors(error.details),
      })
    }

    req[target] = value
  }

  next()
}

module.exports = validateRequest
