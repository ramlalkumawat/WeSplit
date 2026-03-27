const {
  createExpense,
  listExpensesForGroup,
  serializeExpense,
} = require('../services/expenseService')
const { getGroupDetails } = require('../services/groupService')
const { sendResponse } = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const { validateCreateExpense } = require('../utils/validation')

const collectValidationErrors = (details) => details.map((detail) => detail.message)

const listExpenses = asyncHandler(async (req, res) => {
  const expenses = await listExpensesForGroup(req.params.groupId, req.user.id)

  return sendResponse(res, {
    message: 'Expenses fetched successfully',
    data: {
      expenses,
    },
  })
})

const createNewExpense = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateExpense(req.body)

  if (error) {
    throw new AppError('Please fix the expense details and try again', 400, {
      fields: collectValidationErrors(error.details),
    })
  }

  const expense = await createExpense(req.params.groupId, value, req.user.id)
  const groupDetails = await getGroupDetails(req.params.groupId, req.user.id)

  return sendResponse(res, {
    statusCode: 201,
    message: 'Expense added successfully',
    data: {
      expense,
      group: groupDetails.group,
      balances: groupDetails.balances,
      settlements: groupDetails.settlements,
      summary: groupDetails.summary,
      expenses: groupDetails.expenses.map(serializeExpense),
    },
  })
})

module.exports = {
  createNewExpense,
  listExpenses,
}
