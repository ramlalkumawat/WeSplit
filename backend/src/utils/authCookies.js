const {
  cookieSameSite,
  cookieSecure,
  csrfCookieName,
  csrfTokenMaxAgeMs,
  refreshTokenCookieName,
  refreshTokenMaxAgeMs,
} = require('../config/security')

const buildRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  maxAge: refreshTokenMaxAgeMs,
  path: '/api/auth',
  sameSite: cookieSameSite,
  secure: cookieSecure,
})

const buildCsrfCookieOptions = () => ({
  httpOnly: true,
  maxAge: csrfTokenMaxAgeMs,
  path: '/',
  sameSite: cookieSameSite,
  secure: cookieSecure,
})

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(refreshTokenCookieName, refreshToken, buildRefreshTokenCookieOptions())
}

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(refreshTokenCookieName, buildRefreshTokenCookieOptions())
}

const setCsrfTokenCookie = (res, csrfToken) => {
  res.cookie(csrfCookieName, csrfToken, buildCsrfCookieOptions())
}

const clearCsrfTokenCookie = (res) => {
  res.clearCookie(csrfCookieName, buildCsrfCookieOptions())
}

module.exports = {
  clearCsrfTokenCookie,
  clearRefreshTokenCookie,
  setCsrfTokenCookie,
  setRefreshTokenCookie,
}
