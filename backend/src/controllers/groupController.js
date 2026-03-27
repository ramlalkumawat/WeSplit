const {
  addMemberToGroup,
  createGroup,
  getGroupDetails,
  listGroupsForUser,
  removeMemberFromGroup,
} = require('../services/groupService')
const { sendResponse } = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const { validateAddMember, validateCreateGroup } = require('../utils/validation')
const { serializeExpense } = require('../services/expenseService')

const collectValidationErrors = (details) => details.map((detail) => detail.message)

const listGroups = asyncHandler(async (req, res) => {
  const data = await listGroupsForUser(req.user.id)

  return sendResponse(res, {
    message: 'Groups fetched successfully',
    data,
  })
})

const createNewGroup = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateGroup(req.body)

  if (error) {
    throw new AppError('Please fix the group details and try again', 400, {
      fields: collectValidationErrors(error.details),
    })
  }

  const data = await createGroup(value, req.user)

  return sendResponse(res, {
    statusCode: 201,
    message: 'Group created successfully',
    data: {
      ...data,
      expenses: data.expenses.map(serializeExpense),
    },
  })
})

const getGroup = asyncHandler(async (req, res) => {
  const data = await getGroupDetails(req.params.groupId, req.user.id)

  return sendResponse(res, {
    message: 'Group details fetched successfully',
    data: {
      ...data,
      expenses: data.expenses.map(serializeExpense),
    },
  })
})

const getGroupSettlements = asyncHandler(async (req, res) => {
  const data = await getGroupDetails(req.params.groupId, req.user.id)

  return sendResponse(res, {
    message: 'Settlement details fetched successfully',
    data: {
      group: data.group,
      balances: data.balances,
      settlements: data.settlements,
      summary: data.summary,
    },
  })
})

const addMember = asyncHandler(async (req, res) => {
  const { error, value } = validateAddMember(req.body)

  if (error) {
    throw new AppError('Please provide a valid member email', 400, {
      fields: collectValidationErrors(error.details),
    })
  }

  const data = await addMemberToGroup(req.params.groupId, value.email, req.user.id)

  return sendResponse(res, {
    message: 'Member added successfully',
    data: {
      ...data,
      expenses: data.expenses.map(serializeExpense),
    },
  })
})

const removeMember = asyncHandler(async (req, res) => {
  const data = await removeMemberFromGroup(
    req.params.groupId,
    req.params.memberId,
    req.user.id,
  )

  return sendResponse(res, {
    message: 'Member removed successfully',
    data: {
      ...data,
      expenses: data.expenses.map(serializeExpense),
    },
  })
})

module.exports = {
  addMember,
  createNewGroup,
  getGroup,
  getGroupSettlements,
  listGroups,
  removeMember,
}
