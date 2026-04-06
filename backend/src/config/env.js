const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

const VALID_NODE_ENVS = new Set(['development', 'production', 'test'])
const DEFAULT_NODE_ENV = 'development'
const DEFAULT_PORT = 5000
const DEFAULT_HOST = '0.0.0.0'

const normalizeNodeEnv = (value) => {
  const normalizedValue = String(value || DEFAULT_NODE_ENV).trim().toLowerCase()
  return VALID_NODE_ENVS.has(normalizedValue) ? normalizedValue : DEFAULT_NODE_ENV
}

const normalizeOrigin = (value) => {
  if (!value) {
    return null
  }

  try {
    const url = new URL(String(value).trim())

    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }

    return `${url.protocol}//${url.host}`
  } catch (_error) {
    return null
  }
}

const parseOriginList = (value) => {
  const origins = []
  const invalidOrigins = []
  const seenOrigins = new Set()

  String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => {
      const normalizedOrigin = normalizeOrigin(origin)

      if (!normalizedOrigin) {
        invalidOrigins.push(origin)
        return
      }

      if (seenOrigins.has(normalizedOrigin)) {
        return
      }

      seenOrigins.add(normalizedOrigin)
      origins.push(normalizedOrigin)
    })

  return {
    invalidOrigins,
    origins,
  }
}

const parsePort = (value) => {
  const parsedValue = Number.parseInt(String(value || DEFAULT_PORT), 10)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : DEFAULT_PORT
}

const rawNodeEnv = process.env.NODE_ENV
const nodeEnv = normalizeNodeEnv(rawNodeEnv)
const isProduction = nodeEnv === 'production'

process.env.NODE_ENV = nodeEnv

const port = parsePort(process.env.PORT)
const host = String(process.env.HOST || DEFAULT_HOST).trim() || DEFAULT_HOST
const renderExternalUrl = normalizeOrigin(process.env.RENDER_EXTERNAL_URL)
const parsedClientUrlConfig = parseOriginList(process.env.CLIENT_URLS)
const clientUrls = [...parsedClientUrlConfig.origins]

if (renderExternalUrl && !clientUrls.includes(renderExternalUrl)) {
  clientUrls.push(renderExternalUrl)
}

const jwtSecret = String(process.env.JWT_SECRET || '').trim()
const jwtAccessSecret = String(process.env.JWT_ACCESS_SECRET || jwtSecret).trim()
const jwtRefreshSecret = String(process.env.JWT_REFRESH_SECRET || jwtSecret).trim()

const getEnvWarnings = () => {
  const warnings = []

  if (rawNodeEnv && rawNodeEnv !== nodeEnv) {
    warnings.push(
      `Unrecognized NODE_ENV value "${rawNodeEnv}". Falling back to "${nodeEnv}".`,
    )
  }

  if (parsedClientUrlConfig.invalidOrigins.length > 0) {
    warnings.push(
      `Ignoring invalid CLIENT_URLS entr${parsedClientUrlConfig.invalidOrigins.length === 1 ? 'y' : 'ies'}: ${parsedClientUrlConfig.invalidOrigins.join(', ')}`,
    )
  }

  if (isProduction && clientUrls.length === 0) {
    warnings.push(
      'CLIENT_URLS is not set. Cross-origin browser requests may be blocked unless the frontend is served from the same host.',
    )
  }

  return warnings
}

const validateRequiredEnv = () => {
  const missingEnvVars = []

  if (!jwtSecret) {
    missingEnvVars.push('JWT_SECRET')
  }

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
  }
}

module.exports = {
  clientUrls,
  getEnvWarnings,
  host,
  isProduction,
  jwtAccessSecret,
  jwtRefreshSecret,
  nodeEnv,
  port,
  renderExternalUrl,
  validateRequiredEnv,
}
