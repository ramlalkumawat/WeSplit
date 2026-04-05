const express = require('express')
const {
  addMember,
  createNewGroup,
  createNewSettlement,
  getGroup,
  getGroupSettlements,
  listGroups,
  removeMember,
} = require('../controllers/groupController')
const { createNewExpense, listExpenses } = require('../controllers/expenseController')
const { protect } = require('../middleware/auth')
const requireDatabaseConnection = require('../middleware/requireDatabaseConnection')

const router = express.Router()

router.use(requireDatabaseConnection)
router.use(protect)

router.route('/').get(listGroups).post(createNewGroup)
router.route('/:groupId').get(getGroup)
router.route('/:groupId/members').post(addMember)
router.route('/:groupId/members/:memberId').delete(removeMember)
router.route('/:groupId/expenses').get(listExpenses).post(createNewExpense)
router.route('/:groupId/settlements').get(getGroupSettlements).post(createNewSettlement)

module.exports = router
