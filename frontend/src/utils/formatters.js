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
