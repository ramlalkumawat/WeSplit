const express = require('express')
const {
  addMember,
  createNewGroup,
  getGroup,
  getGroupSettlements,
  listGroups,
  removeMember,
} = require('../controllers/groupController')
const { createNewExpense, listExpenses } = require('../controllers/expenseController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

router.route('/').get(listGroups).post(createNewGroup)
router.route('/:groupId').get(getGroup)
router.route('/:groupId/members').post(addMember)
router.route('/:groupId/members/:memberId').delete(removeMember)
router.route('/:groupId/expenses').get(listExpenses).post(createNewExpense)
router.route('/:groupId/settlements').get(getGroupSettlements)

module.exports = router
