export const currencyOptions = [
  { code: 'INR', label: 'Indian Rupee', symbol: 'Rs' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: 'EUR' },
  { code: 'GBP', label: 'British Pound', symbol: 'GBP' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'AED' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'SGD' },
]

export const expenseCategoryOptions = [
  {
    value: 'housing',
    label: 'Housing',
    description: 'Rent, deposits, repairs, and home essentials.',
    color: '#155eef',
  },
  {
    value: 'food',
    label: 'Food & Dining',
    description: 'Meals, groceries, cafe runs, and dinner tabs.',
    color: '#f79009',
  },
  {
    value: 'transport',
    label: 'Transport',
    description: 'Cabs, petrol, tolls, metro, and travel hops.',
    color: '#12b76a',
  },
  {
    value: 'utilities',
    label: 'Utilities',
    description: 'Wi-Fi, electricity, subscriptions, and recurring bills.',
    color: '#7a5af8',
  },
  {
    value: 'travel',
    label: 'Travel',
    description: 'Flights, stays, visas, itineraries, and tours.',
    color: '#ef6820',
  },
  {
    value: 'entertainment',
    label: 'Entertainment',
    description: 'Movies, concerts, games, and shared fun spend.',
    color: '#f04438',
  },
  {
    value: 'team',
    label: 'Team Spend',
    description: 'Office lunches, reimbursements, and team operations.',
    color: '#0ba5ec',
  },
  {
    value: 'shopping',
    label: 'Shopping',
    description: 'Bulk buys, supplies, and event purchases.',
    color: '#ee46bc',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Anything else your group wants to keep visible.',
    color: '#667085',
  },
]

export const expenseCategoryMap = expenseCategoryOptions.reduce((accumulator, item) => {
  accumulator[item.value] = item
  return accumulator
}, {})
