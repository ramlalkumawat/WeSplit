const ms = require('ms')
const {
  clientUrls: allowedOrigins,
  isProduction,
  jwtAccessSecret,
  jwtRefreshSecret,
} = require('./env')

const normalizeSameSite = (value) => {
  const normalizedValue = String(value || 'lax').trim().toLowerCase()

  if (['strict', 'lax', 'none'].includes(normalizedValue)) {
    return normalizedValue
  }

  return 'lax'
}

const parseDurationMs = (value, fallbackValue) => {
  if (!value) {
    return ms(fallbackValue)
  }

  if (typeof value === 'number') {
    return value
  }

  const parsedValue = ms(String(value))
  return typeof parsedValue === 'number' ? parsedValue : ms(fallbackValue)
}

const getBooleanEnv = (value, fallbackValue = false) => {
  if (value === undefined) {
    return fallbackValue
  }

  return String(value).trim().toLowerCase() === 'true'
}

const accessTokenExpiresIn = process.env.JWT_ACCESS_EXPIRE || '15m'
const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRE || '7d'
const refreshTokenMaxAgeMs = parseDurationMs(refreshTokenExpiresIn, '7d')
const csrfTokenMaxAgeMs = parseDurationMs(process.env.CSRF_TOKEN_EXPIRE, refreshTokenExpiresIn)

const cookieSecure = getBooleanEnv(process.env.COOKIE_SECURE, isProduction)
const cookieSameSite = normalizeSameSite(process.env.COOKIE_SAME_SITE)
const trustProxy = getBooleanEnv(process.env.TRUST_PROXY, isProduction)
const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12)

const accessTokenSecret = jwtAccessSecret
const refreshTokenSecret = jwtRefreshSecret

module.exports = {
  accessTokenExpiresIn,
  accessTokenSecret,
  allowedOrigins,
  bcryptSaltRounds,
  cookieSameSite,
  cookieSecure,
  csrfCookieName: process.env.CSRF_COOKIE_NAME || 'wesplit_csrf',
  csrfTokenMaxAgeMs,
  isProduction,
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'wesplit_refresh',
  refreshTokenExpiresIn,
  refreshTokenMaxAgeMs,
  refreshTokenSecret,
  trustProxy,
}
