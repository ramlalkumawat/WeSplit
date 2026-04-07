const ms = require('ms')
const {
  clientUrls: allowedOrigins,
  isProduction,
  jwtAccessSecret,
  jwtRefreshSecret,
  renderExternalUrl,
} = require('./env')

const normalizeSameSite = (value, fallbackValue = 'lax') => {
  const normalizedFallbackValue = String(fallbackValue || 'lax').trim().toLowerCase() || 'lax'
  const normalizedValue = String(value || normalizedFallbackValue).trim().toLowerCase()

  if (['strict', 'lax', 'none'].includes(normalizedValue)) {
    return normalizedValue
  }

  return ['strict', 'lax', 'none'].includes(normalizedFallbackValue) ? normalizedFallbackValue : 'lax'
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

const hasCrossOriginClient = isProduction && allowedOrigins.some((origin) => origin !== renderExternalUrl)
const cookieSameSite = normalizeSameSite(process.env.COOKIE_SAME_SITE, hasCrossOriginClient ? 'none' : 'lax')
const cookieSecure = getBooleanEnv(process.env.COOKIE_SECURE, isProduction || cookieSameSite === 'none')
const trustProxy = getBooleanEnv(process.env.TRUST_PROXY, isProduction)
const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12)

const accessTokenSecret = jwtAccessSecret
const refreshTokenSecret = jwtRefreshSecret

const getSecurityWarnings = () => {
  const warnings = []

  if (hasCrossOriginClient && cookieSameSite !== 'none') {
    warnings.push(
      'Cross-origin browser auth is configured, but COOKIE_SAME_SITE is not "none". Login and signup cookies may be rejected by browsers.',
    )
  }

  if (cookieSameSite === 'none' && !cookieSecure) {
    warnings.push(
      'COOKIE_SAME_SITE is "none" while COOKIE_SECURE is false. Browsers will reject these cookies over cross-site HTTPS requests.',
    )
  }

  return warnings
}

module.exports = {
  accessTokenExpiresIn,
  accessTokenSecret,
  allowedOrigins,
  bcryptSaltRounds,
  cookieSameSite,
  cookieSecure,
  csrfCookieName: process.env.CSRF_COOKIE_NAME || 'wesplit_csrf',
  csrfTokenMaxAgeMs,
  getSecurityWarnings,
  hasCrossOriginClient,
  isProduction,
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'wesplit_refresh',
  refreshTokenExpiresIn,
  refreshTokenMaxAgeMs,
  refreshTokenSecret,
  trustProxy,
}
