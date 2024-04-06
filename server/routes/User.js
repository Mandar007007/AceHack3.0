const express = require('express');
const { register, login, verifyOTP, logout } = require('../controllers/User');
const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.post('/verify',verifyOTP)
router.post('/logout',logout)

module.exports = router;