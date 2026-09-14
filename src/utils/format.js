const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function formatMoney(value, currency = 'INR') {
  const amount = Number(value)
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `
  if (Number.isNaN(amount)) return `${symbol}0`
  return `${symbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function initialsFromEmail(email = '') {
  const namePart = email.split('@')[0] ?? ''
  const segments = namePart.split(/[._-]/).filter(Boolean)
  if (segments.length === 0) return 'FV'
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase()
  return `${segments[0][0]}${segments[1][0]}`.toUpperCase()
}
