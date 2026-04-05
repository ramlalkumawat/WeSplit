const { getClientIp, logSecurityEvent } = require('../utils/securityLogger')

const createRateLimiter = ({
  keyPrefix = 'global',
  limit = 60,
  windowMs = 60 * 1000,
  message = 'Too many requests. Please try again later.',
  keyGenerator,
} = {}) => {
  const requestStore = new Map()

  return (req, res, next) => {
    const now = Date.now()
    const identifier = keyGenerator?.(req) || `${keyPrefix}:${getClientIp(req)}`
    const currentEntry = requestStore.get(identifier) || []
    const activeTimestamps = currentEntry.filter((timestamp) => now - timestamp < windowMs)
    const remaining = Math.max(limit - activeTimestamps.length - 1, 0)

    res.setHeader('X-RateLimit-Limit', limit)
    res.setHeader('X-RateLimit-Remaining', remaining)

    if (activeTimestamps.length >= limit) {
      const retryAfterSeconds = Math.ceil(windowMs / 1000)
      res.setHeader('Retry-After', retryAfterSeconds)

      logSecurityEvent({
        event: 'rate_limit_triggered',
        req,
        details: {
          identifier,
          keyPrefix,
          limit,
          windowMs,
        },
      })

      return res.status(429).json({
        success: false,
        message,
      })
    }

    activeTimestamps.push(now)
    requestStore.set(identifier, activeTimestamps)

    if (requestStore.size > 5000) {
      for (const [entryKey, timestamps] of requestStore.entries()) {
        const freshTimestamps = timestamps.filter((timestamp) => now - timestamp < windowMs)

        if (freshTimestamps.length === 0) {
          requestStore.delete(entryKey)
        } else {
          requestStore.set(entryKey, freshTimestamps)
        }
      }
    }

    return next()
  }
}

module.exports = {
  createRateLimiter,
}
