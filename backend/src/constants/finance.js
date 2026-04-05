const EXPENSE_CATEGORIES = [
  'housing',
  'food',
  'transport',
  'utilities',
  'travel',
  'entertainment',
  'team',
  'shopping',
  'other',
]

const EXPENSE_CATEGORY_META = {
  housing: {
    label: 'Housing',
    color: '#155eef',
  },
  food: {
    label: 'Food & Dining',
    color: '#f79009',
  },
  transport: {
    label: 'Transport',
    color: '#12b76a',
  },
  utilities: {
    label: 'Utilities',
    color: '#7a5af8',
  },
  travel: {
    label: 'Travel',
    color: '#ef6820',
  },
  entertainment: {
    label: 'Entertainment',
    color: '#f04438',
  },
  team: {
    label: 'Team Spend',
    color: '#0ba5ec',
  },
  shopping: {
    label: 'Shopping',
    color: '#ee46bc',
  },
  other: {
    label: 'Other',
    color: '#667085',
  },
}

const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD']

module.exports = {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_META,
  SUPPORTED_CURRENCIES,
}
