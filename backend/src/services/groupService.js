const Expense = require('../models/Expense')
const Group = require('../models/Group')
const User = require('../models/User')
const AppError = require('../utils/appError')
const { buildGroupFinancials, serializeMemberUser } = require('./settlementService')

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

const buildGroupOverview = (group, financials, expenses, currentUserId) => ({
  ...serializeGroup(group, currentUserId),
  memberCount: group.members.length,
  expenseCount: expenses.length,
  totalExpenses: financials.summary.totalExpenses,
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
      },
    }
  }

  const expenses = await Expense.find({ group: { $in: groups.map((group) => group._id) } })
    .sort({ createdAt: -1 })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email')

  const expensesByGroup = expenses.reduce((accumulator, expense) => {
    const groupId = expense.group.toString()
    accumulator[groupId] = accumulator[groupId] || []
    accumulator[groupId].push(expense)
    return accumulator
  }, {})

  const serializedGroups = groups.map((group) => {
    const groupExpenses = expensesByGroup[group._id.toString()] || []
    const financials = buildGroupFinancials({
      group,
      expenses: groupExpenses,
      currentUserId: userId,
    })

    return buildGroupOverview(group, financials, groupExpenses, userId)
  })

  const overview = serializedGroups.reduce(
    (accumulator, group) => ({
      groupCount: accumulator.groupCount + 1,
      totalOwed: accumulator.totalOwed + group.yourOwed,
      totalOwe: accumulator.totalOwe + group.yourOwe,
      netBalance: accumulator.netBalance + group.yourBalance,
    }),
    {
      groupCount: 0,
      totalOwed: 0,
      totalOwe: 0,
      netBalance: 0,
    },
  )

  return {
    groups: serializedGroups,
    overview,
  }
}

const getGroupDetails = async (groupId, userId) => {
  const group = await getGroupByIdForUser(groupId, userId)
  const expenses = await getGroupExpenses(groupId)
  const financials = buildGroupFinancials({
    group,
    expenses,
    currentUserId: userId,
  })

  return {
    group: serializeGroup(group, userId),
    expenses,
    ...financials,
  }
}

const createGroup = async ({ name, description, memberEmails }, currentUser) => {
  const normalizedEmails = [...new Set(memberEmails.map((email) => email.toLowerCase()))].filter(
    (email) => email !== currentUser.email.toLowerCase(),
  )

  const additionalMembers = normalizedEmails.length
    ? await User.find({ email: { $in: normalizedEmails } })
    : []

  if (additionalMembers.length !== normalizedEmails.length) {
    const foundEmails = new Set(additionalMembers.map((user) => user.email.toLowerCase()))
    const missingEmails = normalizedEmails.filter((email) => !foundEmails.has(email))
    throw new AppError(`These users were not found: ${missingEmails.join(', ')}`, 404)
  }

  const group = await Group.create({
    name,
    description,
    createdBy: currentUser.id,
    members: [
      { user: currentUser.id, role: 'admin' },
      ...additionalMembers.map((user) => ({ user: user._id, role: 'member' })),
    ],
  })

  return getGroupDetails(group._id.toString(), currentUser.id)
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

  if (memberHasExpenses) {
    throw new AppError(
      'This member has expense history in the group and cannot be removed',
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
  getGroupByIdForUser,
  getGroupDetails,
  getGroupExpenses,
  listGroupsForUser,
  removeMemberFromGroup,
  requireGroupAdmin,
  serializeGroup,
}
