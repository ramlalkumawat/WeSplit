const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100

const serializeMemberUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
})

const buildGroupFinancials = ({ group, expenses, currentUserId }) => {
  const balanceMap = new Map()

  group.members.forEach((member) => {
    balanceMap.set(member.user._id.toString(), {
      user: serializeMemberUser(member.user),
      role: member.role,
      joinedAt: member.joinedAt,
      paid: 0,
      owes: 0,
      balance: 0,
    })
  })

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

  const balances = Array.from(balanceMap.values()).map((entry) => ({
    ...entry,
    paid: roundCurrency(entry.paid),
    owes: roundCurrency(entry.owes),
    balance: roundCurrency(entry.paid - entry.owes),
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
    }

  const totalExpenses = roundCurrency(
    expenses.reduce((sum, expense) => sum + expense.amount, 0),
  )

  return {
    balances,
    settlements,
    summary: {
      totalExpenses,
      totalMembers: group.members.length,
      yourBalance: roundCurrency(currentUserBalance.balance),
      yourOwed: roundCurrency(Math.max(currentUserBalance.balance, 0)),
      yourOwe: roundCurrency(Math.max(currentUserBalance.balance * -1, 0)),
    },
  }
}

module.exports = {
  buildGroupFinancials,
  roundCurrency,
  serializeMemberUser,
}
