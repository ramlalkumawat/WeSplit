const Expense = require('../models/Expense')
const AppError = require('../utils/appError')
const { getGroupByIdForUser } = require('./groupService')
const { roundCurrency, serializeMemberUser } = require('./settlementService')

const serializeExpense = (expense) => ({
  id: expense._id.toString(),
  title: expense.title,
  description: expense.description,
  amount: expense.amount,
  splitType: expense.splitType,
  createdAt: expense.createdAt,
  updatedAt: expense.updatedAt,
  paidBy: serializeMemberUser(expense.paidBy),
  participants: expense.participants.map((participant) => ({
    user: serializeMemberUser(participant.user),
    share: participant.share,
  })),
})

const buildEqualSplits = (amount, participantUserIds) => {
  const totalCents = Math.round(amount * 100)
  const baseShareCents = Math.floor(totalCents / participantUserIds.length)
  const remainder = totalCents % participantUserIds.length

  return participantUserIds.map((participantUserId, index) => ({
    user: participantUserId,
    share: (baseShareCents + (index < remainder ? 1 : 0)) / 100,
  }))
}

const buildCustomSplits = (amount, participantUserIds, splits) => {
  const participantIdSet = new Set(participantUserIds)
  const uniqueSplitUsers = new Set(splits.map((split) => split.userId))

  if (participantIdSet.size !== uniqueSplitUsers.size) {
    throw new AppError('Each selected participant must have exactly one split amount', 400)
  }

  const invalidSplitUser = splits.find((split) => !participantIdSet.has(split.userId))

  if (invalidSplitUser) {
    throw new AppError('Custom splits must match the selected participants', 400)
  }

  const totalSplitAmount = roundCurrency(
    splits.reduce((sum, split) => sum + Number(split.share || 0), 0),
  )

  if (roundCurrency(totalSplitAmount) !== roundCurrency(amount)) {
    throw new AppError('Custom split amounts must add up to the total expense', 400)
  }

  return splits.map((split) => ({
    user: split.userId,
    share: roundCurrency(split.share),
  }))
}

const createExpense = async (groupId, payload, requesterId) => {
  const group = await getGroupByIdForUser(groupId, requesterId)
  const groupMemberIds = new Set(group.members.map((member) => member.user._id.toString()))

  if (!groupMemberIds.has(payload.paidByUserId)) {
    throw new AppError('The selected payer is not a member of this group', 400)
  }

  const participantUserIds = [...new Set(payload.participantUserIds)]

  if (participantUserIds.some((participantUserId) => !groupMemberIds.has(participantUserId))) {
    throw new AppError('All participants must belong to the selected group', 400)
  }

  const participants =
    payload.splitType === 'custom'
      ? buildCustomSplits(payload.amount, participantUserIds, payload.splits)
      : buildEqualSplits(payload.amount, participantUserIds)

  const expense = await Expense.create({
    group: groupId,
    title: payload.title,
    description: payload.description,
    amount: roundCurrency(payload.amount),
    splitType: payload.splitType,
    paidBy: payload.paidByUserId,
    participants,
    createdBy: requesterId,
  })

  group.lastActivityAt = new Date()
  await group.save()

  const populatedExpense = await Expense.findById(expense._id)
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email')

  return serializeExpense(populatedExpense)
}

const listExpensesForGroup = async (groupId, requesterId) => {
  await getGroupByIdForUser(groupId, requesterId)

  const expenses = await Expense.find({ group: groupId })
    .sort({ createdAt: -1 })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email')

  return expenses.map(serializeExpense)
}

module.exports = {
  createExpense,
  listExpensesForGroup,
  serializeExpense,
}
