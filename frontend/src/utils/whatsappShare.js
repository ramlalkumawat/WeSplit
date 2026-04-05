import { formatCurrency } from './formatters'

const MAX_SHARED_SETTLEMENTS = 3
const MAX_SHARED_BALANCES = 3

const trimTrailingSlashes = (value = '') => value.replace(/\/+$/, '')

const resolveShareBaseUrl = () => {
  const configuredBaseUrl = trimTrailingSlashes(import.meta.env.VITE_SHARE_BASE_URL || '')

  if (configuredBaseUrl) {
    return configuredBaseUrl
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlashes(window.location.origin)
  }

  return ''
}

export const buildGroupLink = (groupId) => {
  const baseUrl = resolveShareBaseUrl()

  if (!groupId) {
    return baseUrl
  }

  return `${baseUrl}/groups/${groupId}`
}

const buildSettlementLines = (settlements = [], currency = 'INR') =>
  settlements
    .slice(0, MAX_SHARED_SETTLEMENTS)
    .map(
      (settlement) =>
        `- ${settlement.fromUser.name} pays ${settlement.toUser.name} ${formatCurrency(settlement.amount, currency)}`,
    )

const buildBalanceLines = (balances = [], currency = 'INR') =>
  [...balances]
    .filter((entry) => Math.abs(Number(entry.balance || 0)) > 0.01)
    .sort((left, right) => Math.abs(right.balance) - Math.abs(left.balance))
    .slice(0, MAX_SHARED_BALANCES)
    .map((entry) => {
      const direction = entry.balance >= 0 ? 'gets' : 'owes'
      return `- ${entry.user.name} ${direction} ${formatCurrency(Math.abs(entry.balance), currency)}`
    })

export const buildGroupWhatsAppShareText = (detail) => {
  if (!detail?.group) {
    return ''
  }

  const { balances = [], group, settlements = [], summary = {} } = detail
  const groupLink = buildGroupLink(group.id)
  const shareLines = settlements.length
    ? buildSettlementLines(settlements, group.currency)
    : buildBalanceLines(balances, group.currency)

  return [
    `Wesplit reminder for ${group.name}`,
    '',
    `Total spent: ${formatCurrency(summary.totalExpenses, group.currency)}`,
    `Settled so far: ${formatCurrency(summary.totalSettled, group.currency)}`,
    `Pending settlements: ${summary.pendingSettlements || 0}`,
    '',
    settlements.length ? 'Current split amounts:' : 'Current balance snapshot:',
    ...(shareLines.length ? shareLines : ['- Group is fully settled right now.']),
    '',
    'Reminder: Please review the latest split and mark payments as settled in Wesplit.',
    '',
    `Wesplit group link: ${groupLink}`,
  ].join('\n')
}

export const buildSettlementReminderText = ({ detail, settlement }) => {
  if (!detail?.group || !settlement) {
    return ''
  }

  const groupLink = buildGroupLink(detail.group.id)

  return [
    `Wesplit payment reminder for ${detail.group.name}`,
    '',
    `${settlement.fromUser.name} should pay ${settlement.toUser.name} ${formatCurrency(
      settlement.amount,
      detail.group.currency,
    )}.`,
    'This reminder is based on the latest split in Wesplit.',
    '',
    'Reminder: Please complete the payment and mark it as settled in the group.',
    '',
    `Wesplit group link: ${groupLink}`,
  ].join('\n')
}

export const shareMessageOnWhatsApp = async (message) => {
  const trimmedMessage = String(message || '').trim()

  if (!trimmedMessage) {
    throw new Error('Nothing is ready to share on WhatsApp yet.')
  }

  if (typeof window === 'undefined') {
    throw new Error('WhatsApp sharing is only available in the browser.')
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(trimmedMessage)}`
  const shareWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

  if (shareWindow) {
    return {
      status: 'opened',
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(trimmedMessage)

    return {
      status: 'copied',
    }
  }

  throw new Error('Unable to open WhatsApp right now. Please allow popups and try again.')
}
