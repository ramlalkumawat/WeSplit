const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const AppError = require('../utils/appError')
const { refreshTokenMaxAgeMs } = require('../config/security')
const { getClientIp, logSecurityEvent } = require('../utils/securityLogger')
const {
  createAccessToken,
  createRefreshToken,
  createTokenId,
  hashToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils')

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

const buildAuthPayload = (user) => ({
  accessToken: createAccessToken(user._id.toString()),
  user: serializeUser(user),
})

const buildSessionMetadata = (req) => ({
  createdByIp: getClientIp(req),
  userAgent: req.get('user-agent') || 'unknown',
})

const createRefreshTokenSession = async ({ user, req, familyId = createTokenId() }) => {
  const jti = createTokenId()
  const refreshToken = createRefreshToken({
    familyId,
    tokenId: jti,
    userId: user._id.toString(),
  })

  await RefreshToken.create({
    user: user._id,
    family: familyId,
    jti,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + refreshTokenMaxAgeMs),
    ...buildSessionMetadata(req),
  })

  return {
    ...buildAuthPayload(user),
    refreshToken,
  }
}

const revokeRefreshTokenFamily = async (familyId, reason, req, userId = null) => {
  await RefreshToken.updateMany(
    {
      family: familyId,
      revokedAt: null,
    },
    {
      $set: {
        compromisedAt: new Date(),
        revokedAt: new Date(),
      },
    },
  )

  logSecurityEvent({
    event: 'refresh_token_family_revoked',
    req,
    userId,
    details: {
      familyId,
      reason,
    },
  })
}

const registerUser = async ({ name, email, password }, req) => {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new AppError('An account already exists for this email address', 409)
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  return createRefreshTokenSession({ req, user })
}

const loginUser = async ({ email, password }, req) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    logSecurityEvent({
      event: 'login_user_not_found',
      req,
      details: {
        email,
      },
    })

    throw new AppError('Invalid email or password', 401)
  }

  const isPasswordValid = await user.matchPassword(password)

  if (!isPasswordValid) {
    logSecurityEvent({
      event: 'login_password_mismatch',
      req,
      userId: user._id.toString(),
      details: {
        email,
      },
    })

    throw new AppError('Invalid email or password', 401)
  }

  return createRefreshTokenSession({ req, user })
}

const rotateRefreshToken = async (refreshTokenValue, req) => {
  if (!refreshTokenValue) {
    throw new AppError('Session refresh token is required', 401)
  }

  const decoded = verifyRefreshToken(refreshTokenValue)

  if (decoded.type !== 'refresh') {
    throw new AppError('Refresh token is invalid', 401)
  }

  const storedToken = await RefreshToken.findOne({ jti: decoded.jti })

  if (!storedToken) {
    logSecurityEvent({
      event: 'refresh_token_missing_record',
      req,
      details: {
        jti: decoded.jti,
      },
    })

    throw new AppError('Session is invalid or has expired', 401)
  }

  if (storedToken.tokenHash !== hashToken(refreshTokenValue)) {
    await revokeRefreshTokenFamily(decoded.family, 'token_hash_mismatch', req, decoded.sub)
    throw new AppError('Session is invalid or has expired', 401)
  }

  if (storedToken.revokedAt || storedToken.compromisedAt || storedToken.expiresAt < new Date()) {
    await revokeRefreshTokenFamily(decoded.family, 'reused_or_expired_token', req, decoded.sub)
    throw new AppError('Session is invalid or has expired', 401)
  }

  const user = await User.findById(decoded.sub)

  if (!user) {
    await revokeRefreshTokenFamily(decoded.family, 'user_missing', req, decoded.sub)
    throw new AppError('User account was not found', 404)
  }

  const replacement = await createRefreshTokenSession({
    familyId: decoded.family,
    req,
    user,
  })

  storedToken.revokedAt = new Date()
  storedToken.rotatedAt = new Date()
  storedToken.replacedByJti = verifyRefreshToken(replacement.refreshToken).jti
  storedToken.lastUsedAt = new Date()
  storedToken.lastUsedIp = getClientIp(req)
  await storedToken.save()

  return replacement
}

const logoutUser = async (refreshTokenValue, req) => {
  if (!refreshTokenValue) {
    return
  }

  try {
    const decoded = verifyRefreshToken(refreshTokenValue)
    const storedToken = await RefreshToken.findOne({ jti: decoded.jti })

    if (!storedToken) {
      return
    }

    if (!storedToken.revokedAt) {
      storedToken.revokedAt = new Date()
      storedToken.lastUsedAt = new Date()
      storedToken.lastUsedIp = getClientIp(req)
      await storedToken.save()
    }
  } catch (error) {
    logSecurityEvent({
      event: 'logout_with_invalid_refresh_token',
      req,
      details: {
        message: error.message,
      },
    })
  }
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
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  revokeRefreshTokenFamily,
  rotateRefreshToken,
  serializeUser,
}
