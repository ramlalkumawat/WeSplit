const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/appError')

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

const buildAuthPayload = (user) => ({
  token: generateToken(user._id),
  user: serializeUser(user),
})

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new AppError('An account already exists for this email address', 409)
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  return buildAuthPayload(user)
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  const isPasswordValid = await user.matchPassword(password)

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401)
  }

  return buildAuthPayload(user)
}

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError('User account was not found', 404)
  }

  return serializeUser(user)
}

module.exports = {
  buildAuthPayload,
  generateToken,
  getCurrentUser,
  loginUser,
  registerUser,
  serializeUser,
}
