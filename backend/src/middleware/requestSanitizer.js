const AppError = require('../utils/appError')

const DANGEROUS_KEY_PATTERN = /(^\$)|(\.)|(^__proto__$)|(^prototype$)|(^constructor$)/i

const sanitizeValue = (value, path = 'request') => {
  if (Array.isArray(value)) {
    return value.map((entry, index) => sanitizeValue(entry, `${path}[${index}]`))
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((accumulator, [key, nestedValue]) => {
      if (DANGEROUS_KEY_PATTERN.test(key)) {
        throw new AppError(`Unsafe input key detected at ${path}.${key}`, 400)
      }

      accumulator[key] = sanitizeValue(nestedValue, `${path}.${key}`)
      return accumulator
    }, {})
  }

  if (typeof value === 'string') {
    return value.replace(/\u0000/g, '')
  }

  return value
}

const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body, 'body')
  }

  if (req.query) {
    req.query = sanitizeValue(req.query, 'query')
  }

  if (req.params) {
    req.params = sanitizeValue(req.params, 'params')
  }

  next()
}

module.exports = sanitizeRequest
