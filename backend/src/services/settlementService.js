const { EXPENSE_CATEGORY_META } = require('../constants/finance')

const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100

const monthLabelFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
})

const serializeMemberUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
})

const serializeSettlementRecord = (settlement) => ({
  id: settlement._id.toString(),
  amount: settlement.amount,
  note: settlement.note,
  createdAt: settlement.createdAt,
  updatedAt: settlement.updatedAt,
  paidBy: serializeMemberUser(settlement.paidBy),
  receivedBy: serializeMemberUser(settlement.receivedBy),
})

const buildInitialBalanceMap = (group) => {
  const balanceMap = new Map()

  group.members.forEach((member) => {
    balanceMap.set(member.user._id.toString(), {
      user: serializeMemberUser(member.user),
      role: member.role,
      joinedAt: member.joinedAt,
      paid: 0,
      owes: 0,
      settled: 0,
      received: 0,
      balance: 0,
    })
  })

  return balanceMap
}

const applyExpensesToBalanceMap = (balanceMap, expenses) => {
  expenses.forEach((expense) => {
    const paidById = expense.paidBy._id.toString()
    const payerEntry = balanceMap.get(paidById)

    if (payerEntry) {
      payerEntry.paid = roundCurrency(payerEntry.paid + expense.amount)
    }

    expense.participants.forEach((participant) => {
      const participantId = participant.user._id.toString()
      const participantEntry = balanceMap.get(participantId)

      if (participantEntry) {
        participantEntry.owes = roundCurrency(participantEntry.owes + participant.share)
      }
    })
  })
}

const applySettlementsToBalanceMap = (balanceMap, settlementRecords) => {
  settlementRecords.forEach((settlement) => {
    const payerEntry = balanceMap.get(settlement.paidBy._id.toString())
    const receiverEntry = balanceMap.get(settlement.receivedBy._id.toString())

    if (payerEntry) {
      payerEntry.settled = roundCurrency(payerEntry.settled + settlement.amount)
    }

    if (receiverEntry) {
      receiverEntry.received = roundCurrency(receiverEntry.received + settlement.amount)
    }
  })
}

const buildBalances = ({ balanceMap, currentUserId }) => {
  const balances = Array.from(balanceMap.values()).map((entry) => ({
    ...entry,
    paid: roundCurrency(entry.paid),
    owes: roundCurrency(entry.owes),
    settled: roundCurrency(entry.settled),
    received: roundCurrency(entry.received),
    balance: roundCurrency(entry.paid + entry.settled - entry.owes - entry.received),
  }))

  const creditors = balances
    .filter((entry) => entry.balance > 0)
    .map((entry) => ({ ...entry }))
    .sort((a, b) => b.balance - a.balance)

  const debtors = balances
    .filter((entry) => entry.balance < 0)
    .map((entry) => ({ ...entry, balance: Math.abs(entry.balance) }))
    .sort((a, b) => b.balance - a.balance)

  const settlements = []
  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]
    const amount = roundCurrency(Math.min(creditor.balance, debtor.balance))

    if (amount > 0) {
      settlements.push({
        fromUser: debtor.user,
        toUser: creditor.user,
        amount,
      })
    }

    creditor.balance = roundCurrency(creditor.balance - amount)
    debtor.balance = roundCurrency(debtor.balance - amount)

    if (creditor.balance <= 0.01) {
      creditorIndex += 1
    }

    if (debtor.balance <= 0.01) {
      debtorIndex += 1
    }
  }

  const currentUserBalance =
    balances.find((entry) => entry.user.id === currentUserId) ?? {
      balance: 0,
      owes: 0,
      paid: 0,
      settled: 0,
      received: 0,
    }

  return {
    balances,
    settlements,
    currentUserBalance,
  }
}

const buildMonthlyActivity = ({ expenses, settlementRecords }) => {
  const now = new Date()
  const buckets = []
  const bucketMap = new Map()

  for (let index = 5; index >= 0; index -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - index, 1)
    const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`
    const bucket = {
      key,
      label: monthLabelFormatter.format(monthDate),
      expenseTotal: 0,
      settlementTotal: 0,
    }

    buckets.push(bucket)
    bucketMap.set(key, bucket)
  }

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.createdAt)
    const key = `${expenseDate.getFullYear()}-${expenseDate.getMonth()}`
    const bucket = bucketMap.get(key)

    if (bucket) {
      bucket.expenseTotal = roundCurrency(bucket.expenseTotal + expense.amount)
    }
  })

  settlementRecords.forEach((settlement) => {
    const settlementDate = new Date(settlement.createdAt)
    const key = `${settlementDate.getFullYear()}-${settlementDate.getMonth()}`
    const bucket = bucketMap.get(key)

    if (bucket) {
      bucket.settlementTotal = roundCurrency(bucket.settlementTotal + settlement.amount)
    }
  })

  return buckets.map(({ key, ...bucket }) => ({
    ...bucket,
    activityTotal: roundCurrency(bucket.expenseTotal + bucket.settlementTotal),
    key,
  }))
}

const buildCategoryBreakdown = ({ expenses, totalExpenses }) => {
  if (!totalExpenses) {
    return []
  }

  const categoryTotals = expenses.reduce((accumulator, expense) => {
    const category = expense.category || 'other'
    accumulator[category] = roundCurrency((accumulator[category] || 0) + expense.amount)
    return accumulator
  }, {})

  return Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      label: EXPENSE_CATEGORY_META[category]?.label || 'Other',
      color: EXPENSE_CATEGORY_META[category]?.color || EXPENSE_CATEGORY_META.other.color,
      total,
      shareOfSpend: roundCurrency((total / totalExpenses) * 100),
    }))
    .sort((a, b) => b.total - a.total)
}

const buildRecentActivity = ({ expenses, settlementRecords }) =>
  [
    ...expenses.map((expense) => ({
      id: expense._id.toString(),
      type: 'expense',
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      createdAt: expense.createdAt,
      category: expense.category || 'other',
      actor: serializeMemberUser(expense.paidBy),
      subtitle: `${expense.paidBy.name} paid for ${expense.participants.length} participant${
        expense.participants.length === 1 ? '' : 's'
      }`,
    })),
    ...settlementRecords.map((settlement) => ({
      id: settlement._id.toString(),
      type: 'settlement',
      title: 'Settlement recorded',
      description: settlement.note,
      amount: settlement.amount,
      createdAt: settlement.createdAt,
      actor: serializeMemberUser(settlement.paidBy),
      subtitle: `${settlement.paidBy.name} paid ${settlement.receivedBy.name}`,
    })),
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 8)

const buildGroupAnalytics = ({ balances, expenses, settlementRecords, summary }) => ({
  categoryBreakdown: buildCategoryBreakdown({
    expenses,
    totalExpenses: summary.totalExpenses,
  }),
  monthlyActivity: buildMonthlyActivity({
    expenses,
    settlementRecords,
  }),
  memberActivity: [...balances].sort(
    (left, right) => Math.abs(right.balance) - Math.abs(left.balance),
  ),
  recentActivity: buildRecentActivity({
    expenses,
    settlementRecords,
  }),
})

const buildGroupFinancials = ({
  group,
  expenses,
  settlementRecords = [],
  currentUserId,
}) => {
  const balanceMap = buildInitialBalanceMap(group)

  applyExpensesToBalanceMap(balanceMap, expenses)
  applySettlementsToBalanceMap(balanceMap, settlementRecords)

  const { balances, settlements, currentUserBalance } = buildBalances({
    balanceMap,
    currentUserId,
  })

  const totalExpenses = roundCurrency(
    expenses.reduce((sum, expense) => sum + expense.amount, 0),
  )
  const totalSettled = roundCurrency(
    settlementRecords.reduce((sum, settlement) => sum + settlement.amount, 0),
  )

  return {
    balances,
    settlements,
    summary: {
      totalExpenses,
      totalSettled,
      totalMembers: group.members.length,
      expenseCount: expenses.length,
      settlementCount: settlementRecords.length,
      pendingSettlements: settlements.length,
      yourBalance: roundCurrency(currentUserBalance.balance),
      yourOwed: roundCurrency(Math.max(currentUserBalance.balance, 0)),
      yourOwe: roundCurrency(Math.max(currentUserBalance.balance * -1, 0)),
      yourSettled: roundCurrency(currentUserBalance.settled),
      yourReceived: roundCurrency(currentUserBalance.received),
    },
  }
}

module.exports = {
  buildGroupAnalytics,
  buildGroupFinancials,
  roundCurrency,
  serializeMemberUser,
  serializeSettlementRecord,
}
