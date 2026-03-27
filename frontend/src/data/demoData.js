export const TOKEN_KEY = 'wesplit-token'

export const STORAGE_KEYS = {
  groups: 'wesplit-demo-groups',
  expenses: 'wesplit-demo-expenses',
}

export const initialGroups = [
  {
    id: 'group-roommates',
    name: 'Flatmates',
    description: 'Rent, groceries, and home essentials shared across the flat.',
    members: 4,
    lastActivity: 'Updated 2h ago',
  },
  {
    id: 'group-weekend-trip',
    name: 'Goa Trip',
    description: 'Travel, stay, meals, and all the small spends from the getaway.',
    members: 5,
    lastActivity: 'Updated 5h ago',
  },
  {
    id: 'group-product-team',
    name: 'Office Team',
    description: 'Team lunches, subscriptions, and work celebration spends.',
    members: 6,
    lastActivity: 'Updated yesterday',
  },
]

export const initialExpenses = [
  {
    id: 'expense-1',
    groupId: 'group-roommates',
    title: 'Weekly groceries',
    note: 'You covered the fresh produce run for the whole apartment.',
    amount: 84.2,
    direction: 'owed',
    paidBy: 'Split with 3 people',
    dateLabel: 'Today',
  },
  {
    id: 'expense-2',
    groupId: 'group-roommates',
    title: 'Wi-Fi bill',
    note: 'Sam paid the internet bill and logged your share.',
    amount: 24.75,
    direction: 'owe',
    paidBy: 'Paid by Sam',
    dateLabel: 'Today',
  },
  {
    id: 'expense-3',
    groupId: 'group-weekend-trip',
    title: 'Cab from airport',
    note: 'Shared ride into town after landing.',
    amount: 31.5,
    direction: 'owe',
    paidBy: 'Paid by Priya',
    dateLabel: 'Yesterday',
  },
  {
    id: 'expense-4',
    groupId: 'group-weekend-trip',
    title: 'Beach shack dinner',
    note: 'You paid for the first night dinner by the beach.',
    amount: 126,
    direction: 'owed',
    paidBy: 'Split with 4 people',
    dateLabel: 'Yesterday',
  },
  {
    id: 'expense-5',
    groupId: 'group-product-team',
    title: 'Design subscription',
    note: 'Shared pro workspace renewal for the month.',
    amount: 36,
    direction: 'owe',
    paidBy: 'Paid by Alex',
    dateLabel: '2 days ago',
  },
  {
    id: 'expense-6',
    groupId: 'group-product-team',
    title: 'Sprint demo snacks',
    note: 'You stocked up the demo room before the review.',
    amount: 58.3,
    direction: 'owed',
    paidBy: 'Split with 5 people',
    dateLabel: '2 days ago',
  },
]

export const expenseTemplates = [
  {
    title: 'Coffee catch-up',
    note: 'A quick team stop that kept the conversation going.',
    amount: 18.4,
    direction: 'owed',
    paidBy: 'You paid upfront',
  },
  {
    title: 'Parking split',
    note: 'Shared parking cost added back into the group balance.',
    amount: 12.75,
    direction: 'owe',
    paidBy: 'Paid by Jordan',
  },
  {
    title: 'OTT renewal',
    note: 'Monthly entertainment subscription refreshed for everyone.',
    amount: 26,
    direction: 'owed',
    paidBy: 'You paid upfront',
  },
  {
    title: 'Cab ride home',
    note: 'Late-night ride automatically split across the group.',
    amount: 31.5,
    direction: 'owe',
    paidBy: 'Paid by Taylor',
  },
]
