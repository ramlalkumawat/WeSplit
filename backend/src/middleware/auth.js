const User = require('../models/User')
const AppError = require('../utils/appError')
const asyncHandler = require('../utils/asyncHandler')
const { logSecurityEvent } = require('../utils/securityLogger')
const { verifyAccessToken } = require('../utils/tokenUtils')

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required', 401)
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyAccessToken(token)

  if (decoded.type !== 'access') {
    throw new AppError('Authentication token is invalid', 401)
  }

  const user = await User.findById(decoded.sub)

  if (!user) {
    logSecurityEvent({
      event: 'protected_route_user_missing',
      req,
      details: {
        userId: decoded.sub,
      },
    })

    throw new AppError('Authenticated user could not be found', 401)
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  }

  next()
})

module.exports = { protect }
