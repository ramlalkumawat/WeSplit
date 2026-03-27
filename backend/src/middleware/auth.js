const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/appError')
const asyncHandler = require('../utils/asyncHandler')

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required', 401)
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)

  if (!user) {
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
