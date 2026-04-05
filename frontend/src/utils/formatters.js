const createCurrencyFormatter = (currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  })

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
})

export const formatCurrency = (value = 0, currency = 'INR') =>
  createCurrencyFormatter(currency).format(Number(value || 0))

export const formatDateTime = (value) => {
  if (!value) {
    return 'Just now'
  }

  return dateTimeFormatter.format(new Date(value))
}

export const formatCompactCurrency = (value = 0, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0))

export const formatPercentage = (value = 0) => `${Number(value || 0).toFixed(0)}%`

export const formatRelativeDate = (value) => {
  if (!value) {
    return 'Just now'
  }

  const date = new Date(value)
  const diffInHours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60))
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, 'hour')
  }

  const diffInDays = Math.round(diffInHours / 24)
  return formatter.format(diffInDays, 'day')
}
