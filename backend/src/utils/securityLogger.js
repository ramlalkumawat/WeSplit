const getClientIp = (req) => {
  if (!req) {
    return 'unknown'
  }

  const forwardedFor = req.headers['x-forwarded-for']

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim()
  }

  return req.ip || req.socket?.remoteAddress || 'unknown'
}

const logSecurityEvent = ({ event, req, level = 'warn', userId = null, details = {} }) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    userId: userId || req?.user?.id || null,
    ip: getClientIp(req),
    method: req?.method || null,
    path: req?.originalUrl || null,
    userAgent: req?.get?.('user-agent') || null,
    details,
  }

  const message = `[security] ${JSON.stringify(payload)}`

  if (level === 'error') {
    console.error(message)
    return
  }

  if (level === 'info') {
    console.log(message)
    return
  }

  console.warn(message)
}

module.exports = {
  getClientIp,
  logSecurityEvent,
}
