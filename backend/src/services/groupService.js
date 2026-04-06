const mongoose = require('mongoose')
const Expense = require('../models/Expense')
const Group = require('../models/Group')
const Settlement = require('../models/Settlement')
const User = require('../models/User')
const AppError = require('../utils/appError')
const {
  buildGroupAnalytics,
  buildGroupFinancials,
  roundCurrency,
  serializeMemberUser,
  serializeSettlementRecord,
} = require('./settlementService')

const groupPopulate = [
  { path: 'members.user', select: 'name email' },
  { path: 'createdBy', select: 'name email' },
]

const isMemberOfGroup = (group, userId) =>
  group.members.some((member) => member.user._id.toString() === userId)

const isGroupAdmin = (group, userId) =>
  group.createdBy._id.toString() === userId ||
  group.members.some(
    (member) => member.user._id.toString() === userId && member.role === 'admin',
  )

const serializeGroup = (group, currentUserId) => ({
  id: group._id.toString(),
  name: group.name,
  description: group.description,
  currency: group.currency,
  createdAt: group.createdAt,
  updatedAt: group.updatedAt,
  lastActivityAt: group.lastActivityAt,
  isAdmin: isGroupAdmin(group, currentUserId),
  createdBy: {
    id: group.createdBy._id.toString(),
    name: group.createdBy.name,
    email: group.createdBy.email,
  },
  members: group.members.map((member) => ({
    ...serializeMemberUser(member.user),
    role: member.role,
    joinedAt: member.joinedAt,
  })),
})

const getGroupByIdForUser = async (groupId, userId) => {
  const group = await Group.findById(groupId).populate(groupPopulate)

  if (!group) {
    throw new AppError('Group not found', 404)
  }

  if (!isMemberOfGroup(group, userId)) {
    throw new AppError('You are not allowed to access this group', 403)
  }

  return group
}

const requireGroupAdmin = (group, userId) => {
  if (!isGroupAdmin(group, userId)) {
    throw new AppError('Only group admins can manage members', 403)
  }
}

const getGroupExpenses = async (groupId) =>
  Expense.find({ group: groupId })
    .sort({ createdAt: -1 })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email')

const getGroupSettlementRecords = async (groupId) =>
  Settlement.find({ group: groupId })
    .sort({ createdAt: -1 })
    .populate('paidBy', 'name email')
    .populate('receivedBy', 'name email')

const buildGroupOverview = (group, financials, expenses, currentUserId) => ({
  ...serializeGroup(group, currentUserId),
  memberCount: group.members.length,
  expenseCount: expenses.length,
  totalExpenses: financials.summary.totalExpenses,
  totalSettled: financials.summary.totalSettled,
  pendingSettlements: financials.summary.pendingSettlements,
  yourBalance: financials.summary.yourBalance,
  yourOwed: financials.summary.yourOwed,
  yourOwe: financials.summary.yourOwe,
})

const listGroupsForUser = async (userId) => {
  const groups = await Group.find({ 'members.user': userId })
    .sort({ lastActivityAt: -1 })
    .populate(groupPopulate)

  if (groups.length === 0) {
    return {
      groups: [],
      overview: {
        groupCount: 0,
        totalOwed: 0,
        totalOwe: 0,
        netBalance: 0,
        totalSettled: 0,
        pendingSettlements: 0,
        primaryCurrency: 'INR',
        hasMixedCurrencies: false,
        currencyBreakdown: [],
      },
    }
  }

  const expenses = await Expense.find({
    group: mongoose.trusted({ $in: groups.map((group) => group._id) }),
  })
    .sort({ createdAt: -1 })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email')
  const settlementRecords = await Settlement.find({
    group: mongoose.trusted({ $in: groups.map((group) => group._id) }),
  })
    .sort({ createdAt: -1 })
    .populate('paidBy', 'name email')
    .populate('receivedBy', 'name email')

  const expensesByGroup = expenses.reduce((accumulator, expense) => {
    const groupId = expense.group.toString()
    accumulator[groupId] = accumulator[groupId] || []
    accumulator[groupId].push(expense)
    return accumulator
  }, {})

  const settlementsByGroup = settlementRecords.reduce((accumulator, settlement) => {
    const groupId = settlement.group.toString()
    accumulator[groupId] = accumulator[groupId] || []
    accumulator[groupId].push(settlement)
    return accumulator
  }, {})

  const serializedGroups = groups.map((group) => {
    const groupExpenses = expensesByGroup[group._id.toString()] || []
    const groupSettlements = settlementsByGroup[group._id.toString()] || []
    const financials = buildGroupFinancials({
      group,
      expenses: groupExpenses,
      settlementRecords: groupSettlements,
      currentUserId: userId,
    })

    return buildGroupOverview(group, financials, groupExpenses, userId)
  })

  const currencyOverview = serializedGroups.reduce((accumulator, group) => {
    const currency = group.currency || 'INR'
    const currentValue = accumulator[currency] || {
      currency,
      totalOwed: 0,
      totalOwe: 0,
      netBalance: 0,
      totalSettled: 0,
    }

    accumulator[currency] = {
      currency,
      totalOwed: roundCurrency(currentValue.totalOwed + group.yourOwed),
      totalOwe: roundCurrency(currentValue.totalOwe + group.yourOwe),
      netBalance: roundCurrency(currentValue.netBalance + group.yourBalance),
      totalSettled: roundCurrency(currentValue.totalSettled + group.totalSettled),
    }

    return accumulator
  }, {})

  const currencyBreakdown = Object.values(currencyOverview)
  const primaryCurrency = currencyBreakdown[0]?.currency || 'INR'
  const primaryCurrencyOverview = currencyOverview[primaryCurrency] || {
    totalOwed: 0,
    totalOwe: 0,
    netBalance: 0,
    totalSettled: 0,
  }
  const overview = serializedGroups.reduce(
    (accumulator, group) => ({
      groupCount: accumulator.groupCount + 1,
      pendingSettlements:
        accumulator.pendingSettlements + (group.pendingSettlements || 0),
    }),
    {
      groupCount: 0,
      pendingSettlements: 0,
    },
  )

  return {
    groups: serializedGroups,
    overview: {
      ...overview,
      totalOwed: primaryCurrencyOverview.totalOwed,
      totalOwe: primaryCurrencyOverview.totalOwe,
      netBalance: primaryCurrencyOverview.netBalance,
      totalSettled: primaryCurrencyOverview.totalSettled,
      primaryCurrency,
      hasMixedCurrencies: currencyBreakdown.length > 1,
      currencyBreakdown,
    },
  }
}

const getGroupDetails = async (groupId, userId) => {
  const group = await getGroupByIdForUser(groupId, userId)
  const expenses = await getGroupExpenses(groupId)
  const settlementRecords = await getGroupSettlementRecords(groupId)
  const financials = buildGroupFinancials({
    group,
    expenses,
    settlementRecords,
    currentUserId: userId,
  })
  const analytics = buildGroupAnalytics({
    balances: financials.balances,
    expenses,
    settlementRecords,
    summary: financials.summary,
  })

  return {
    group: serializeGroup(group, userId),
    expenses,
    settlementRecords: settlementRecords.map(serializeSettlementRecord),
    ...financials,
    analytics,
  }
}

const createGroup = async ({ name, description, currency, memberEmails }, currentUser) => {
  const normalizedEmails = [...new Set(memberEmails.map((email) => email.toLowerCase()))].filter(
    (email) => email !== currentUser.email.toLowerCase(),
  )

  const additionalMembers = normalizedEmails.length
    ? await User.find({
        email: mongoose.trusted({ $in: normalizedEmails }),
      })
    : []
  const foundEmails = new Set(additionalMembers.map((user) => user.email.toLowerCase()))
  const missingInviteEmails = normalizedEmails.filter((email) => !foundEmails.has(email))

  const group = await Group.create({
    name,
    description,
    currency,
    createdBy: currentUser.id,
    members: [
      { user: currentUser.id, role: 'admin' },
      ...additionalMembers.map((user) => ({ user: user._id, role: 'member' })),
    ],
  })

  const detail = await getGroupDetails(group._id.toString(), currentUser.id)

  return {
    ...detail,
    missingInviteEmails,
  }
}

const createSettlement = async (groupId, payload, requesterId) => {
  const group = await getGroupByIdForUser(groupId, requesterId)
  const groupMemberIds = new Set(group.members.map((member) => member.user._id.toString()))

  if (payload.paidByUserId === payload.receivedByUserId) {
    throw new AppError('A settlement must happen between two different members', 400)
  }

  if (!groupMemberIds.has(payload.paidByUserId) || !groupMemberIds.has(payload.receivedByUserId)) {
    throw new AppError('Settlement members must belong to the selected group', 400)
  }

  const expenses = await getGroupExpenses(groupId)
  const settlementRecords = await getGroupSettlementRecords(groupId)
  const financials = buildGroupFinancials({
    group,
    expenses,
    settlementRecords,
    currentUserId: requesterId,
  })

  const outstandingSettlement = financials.settlements.find(
    (settlement) =>
      settlement.fromUser.id === payload.paidByUserId &&
      settlement.toUser.id === payload.receivedByUserId,
  )

  if (!outstandingSettlement) {
    throw new AppError(
      'This settlement path is no longer outstanding. Refresh balances and try again.',
      400,
    )
  }

  if (roundCurrency(payload.amount) > roundCurrency(outstandingSettlement.amount)) {
    throw new AppError(
      'Settlement amount cannot exceed the outstanding suggested balance',
      400,
    )
  }

  await Settlement.create({
    group: groupId,
    paidBy: payload.paidByUserId,
    receivedBy: payload.receivedByUserId,
    amount: roundCurrency(payload.amount),
    note: payload.note,
    createdBy: requesterId,
  })

  group.lastActivityAt = new Date()
  await group.save()

  return getGroupDetails(groupId, requesterId)
}

const addMemberToGroup = async (groupId, email, requesterId) => {
  const group = await getGroupByIdForUser(groupId, requesterId)
  requireGroupAdmin(group, requesterId)

  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user) {
    throw new AppError('No account exists for that email address', 404)
  }

  if (isMemberOfGroup(group, user._id.toString())) {
    throw new AppError('This user is already a member of the group', 409)
  }

  group.members.push({
    user: user._id,
    role: 'member',
  })
  group.lastActivityAt = new Date()
  await group.save()

  return getGroupDetails(groupId, requesterId)
}

const removeMemberFromGroup = async (groupId, memberId, requesterId) => {
  const group = await getGroupByIdForUser(groupId, requesterId)
  requireGroupAdmin(group, requesterId)

  if (group.createdBy._id.toString() === memberId) {
    throw new AppError('The group creator cannot be removed', 400)
  }

  if (memberId === requesterId) {
    throw new AppError('You cannot remove yourself from the group here', 400)
  }

  const memberExists = group.members.some((member) => member.user._id.toString() === memberId)

  if (!memberExists) {
    throw new AppError('Group member not found', 404)
  }

  const memberHasExpenses = await Expense.exists({
    group: groupId,
    $or: [{ paidBy: memberId }, { 'participants.user': memberId }],
  })
  const memberHasSettlements = await Settlement.exists({
    group: groupId,
    $or: [{ paidBy: memberId }, { receivedBy: memberId }],
  })

  if (memberHasExpenses || memberHasSettlements) {
    throw new AppError(
      'This member has financial history in the group and cannot be removed',
      400,
    )
  }

  group.members = group.members.filter((member) => member.user._id.toString() !== memberId)
  group.lastActivityAt = new Date()
  await group.save()

  return getGroupDetails(groupId, requesterId)
}

module.exports = {
  addMemberToGroup,
  createGroup,
  createSettlement,
  getGroupByIdForUser,
  getGroupDetails,
  getGroupExpenses,
  getGroupSettlementRecords,
  listGroupsForUser,
  removeMemberFromGroup,
  requireGroupAdmin,
  serializeGroup,
}
