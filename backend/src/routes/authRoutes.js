const express = require('express')
const {
  getCsrfToken,
  getMe,
  login,
  logout,
  refresh,
  signup,
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const { issueCsrfToken, requireCsrfToken } = require('../middleware/csrf')
const requireDatabaseConnection = require('../middleware/requireDatabaseConnection')
const { createRateLimiter } = require('../middleware/rateLimiter')
const validateRequest = require('../middleware/validateRequest')
const { authSchemas } = require('../utils/validation')

const router = express.Router()
const authLimiter = createRateLimiter({
  keyPrefix: 'auth',
  limit: 10,
  windowMs: 15 * 60 * 1000,
  message: 'Too many authentication attempts. Please wait a few minutes before trying again.',
})
const refreshLimiter = createRateLimiter({
  keyPrefix: 'refresh',
  limit: 20,
  windowMs: 15 * 60 * 1000,
  message: 'Too many session refresh attempts. Please try again shortly.',
})

router.get('/csrf-token', issueCsrfToken, getCsrfToken)

router.post(
  '/signup',
  authLimiter,
  issueCsrfToken,
  requireCsrfToken,
  validateRequest(authSchemas.signup),
  requireDatabaseConnection,
  signup,
)
router.post(
  '/register',
  authLimiter,
  issueCsrfToken,
  requireCsrfToken,
  validateRequest(authSchemas.signup),
  requireDatabaseConnection,
  signup,
)
router.post(
  '/login',
  authLimiter,
  issueCsrfToken,
  requireCsrfToken,
  validateRequest(authSchemas.login),
  requireDatabaseConnection,
  login,
)
router.post('/refresh', refreshLimiter, issueCsrfToken, requireCsrfToken, requireDatabaseConnection, refresh)
router.post('/logout', issueCsrfToken, requireCsrfToken, requireDatabaseConnection, logout)

router.get('/me', requireDatabaseConnection, protect, getMe)

module.exports = router
