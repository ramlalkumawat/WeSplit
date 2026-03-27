const { getCurrentUser, loginUser, registerUser } = require('../services/authService')
const { sendResponse } = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const { validateLogin, validateRegister } = require('../utils/validation')

const collectValidationErrors = (details) => details.map((detail) => detail.message)

const signup = asyncHandler(async (req, res) => {
  const { error, value } = validateRegister(req.body)

  if (error) {
    throw new AppError('Please correct the highlighted signup fields', 400, {
      fields: collectValidationErrors(error.details),
    })
  }

  const authPayload = await registerUser(value)

  return sendResponse(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: authPayload,
  })
})

const login = asyncHandler(async (req, res) => {
  const { error, value } = validateLogin(req.body)

  if (error) {
    throw new AppError('Please provide valid login credentials', 400, {
      fields: collectValidationErrors(error.details),
    })
  }

  const authPayload = await loginUser(value)

  return sendResponse(res, {
    message: 'Logged in successfully',
    data: authPayload,
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
  getMe,
  login,
  signup,
}
