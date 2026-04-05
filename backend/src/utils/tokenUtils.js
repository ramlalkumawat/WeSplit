const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {
  accessTokenExpiresIn,
  accessTokenSecret,
  refreshTokenExpiresIn,
  refreshTokenSecret,
} = require('../config/security')

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

const createTokenId = () => crypto.randomUUID()

const createAccessToken = (userId) =>
  jwt.sign(
    {
      sub: userId,
      type: 'access',
    },
    accessTokenSecret,
    {
      audience: 'wesplit-api',
      expiresIn: accessTokenExpiresIn,
      issuer: 'wesplit',
    },
  )

const createRefreshToken = ({ userId, tokenId, familyId }) =>
  jwt.sign(
    {
      sub: userId,
      jti: tokenId,
      family: familyId,
      type: 'refresh',
    },
    refreshTokenSecret,
    {
      audience: 'wesplit-refresh',
      expiresIn: refreshTokenExpiresIn,
      issuer: 'wesplit',
    },
  )

const verifyAccessToken = (token) =>
  jwt.verify(token, accessTokenSecret, {
    audience: 'wesplit-api',
    issuer: 'wesplit',
  })

const verifyRefreshToken = (token) =>
  jwt.verify(token, refreshTokenSecret, {
    audience: 'wesplit-refresh',
    issuer: 'wesplit',
  })

module.exports = {
  createAccessToken,
  createRefreshToken,
  createTokenId,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
}
