const crypto = require('crypto')
const AppError = require('../utils/appError')
const { csrfCookieName } = require('../config/security')
const { setCsrfTokenCookie } = require('../utils/authCookies')
const { logSecurityEvent } = require('../utils/securityLogger')

const generateCsrfToken = () => crypto.randomBytes(32).toString('hex')

const issueCsrfToken = (req, res, next) => {
  const currentToken = req.cookies?.[csrfCookieName] || generateCsrfToken()
  setCsrfTokenCookie(res, currentToken)
  req.csrfToken = currentToken
  next()
}

const requireCsrfToken = (req, res, next) => {
  const cookieToken = req.cookies?.[csrfCookieName]
  const headerToken = req.get('x-csrf-token')

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    logSecurityEvent({
      event: 'csrf_validation_failed',
      req,
      details: {
        hasCookieToken: Boolean(cookieToken),
        hasHeaderToken: Boolean(headerToken),
      },
    })

    throw new AppError('CSRF token validation failed', 403)
  }

  next()
}

module.exports = {
  issueCsrfToken,
  requireCsrfToken,
}
