const sendResponse = (res, { statusCode = 200, success = true, message, data = null, meta } = {}) => {
  const payload = {
    success,
    message,
  }

  if (data !== null) {
    payload.data = data
  }

  if (meta) {
    payload.meta = meta
  }

  return res.status(statusCode).json(payload)
}

module.exports = {
  sendResponse,
}
