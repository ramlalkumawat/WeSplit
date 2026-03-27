const express = require('express')
const { getMe, login, signup } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/signup', signup)
router.post('/register', signup)
router.post('/login', login)

router.get('/me', protect, getMe)

module.exports = router
