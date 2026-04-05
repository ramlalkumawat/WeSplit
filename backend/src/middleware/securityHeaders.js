const helmet = require('helmet')
const { allowedOrigins, isProduction } = require('../config/security')

const connectSources = ["'self'", ...allowedOrigins]

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: connectSources.length > 0 ? connectSources : ["'self'"],
      fontSrc: ["'self'", 'data:'],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: {
    policy: 'same-site',
  },
  hsts: isProduction
    ? {
        includeSubDomains: true,
        maxAge: 31536000,
        preload: true,
      }
    : false,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
})

module.exports = securityHeaders
