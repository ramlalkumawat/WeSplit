const {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  rotateRefreshToken,
} = require('../services/authService')
const { refreshTokenCookieName } = require('../config/security')
const {
  clearCsrfTokenCookie,
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} = require('../utils/authCookies')
const { sendResponse } = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')

const signup = asyncHandler(async (req, res) => {
  const authPayload = await registerUser(req.body, req)
  setRefreshTokenCookie(res, authPayload.refreshToken)

  return sendResponse(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: {
      accessToken: authPayload.accessToken,
      user: authPayload.user,
      csrfToken: req.csrfToken,
    },
  })
})

const login = asyncHandler(async (req, res) => {
  const authPayload = await loginUser(req.body, req)
  setRefreshTokenCookie(res, authPayload.refreshToken)

  return sendResponse(res, {
    message: 'Logged in successfully',
    data: {
      accessToken: authPayload.accessToken,
      user: authPayload.user,
      csrfToken: req.csrfToken,
    },
  })
})

const refresh = asyncHandler(async (req, res) => {
  const authPayload = await rotateRefreshToken(req.cookies?.[refreshTokenCookieName], req)
  setRefreshTokenCookie(res, authPayload.refreshToken)

  return sendResponse(res, {
    message: 'Session refreshed successfully',
    data: {
      accessToken: authPayload.accessToken,
      user: authPayload.user,
      csrfToken: req.csrfToken,
    },
  })
})

const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.cookies?.[refreshTokenCookieName], req)
  clearRefreshTokenCookie(res)
  clearCsrfTokenCookie(res)

  return sendResponse(res, {
    message: 'Logged out successfully',
    data: {
      loggedOut: true,
    },
  })
})

const getCsrfToken = asyncHandler(async (req, res) => {
  return sendResponse(res, {
    message: 'CSRF token issued successfully',
    data: {
      csrfToken: req.csrfToken,
    },
  })
})

const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id)

  return sendResponse(res, {
    message: 'Authenticated user fetched successfully',
    data: {
      user,
    },
  })
})

module.exports = {
  getCsrfToken,
  getMe,
  login,
  logout,
  refresh,
  signup,
}
