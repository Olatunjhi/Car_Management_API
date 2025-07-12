const express = require("express");
const { signup, login, admin, changePassword, forgotPassword, verifyOtp, resetPassword, verifyEmail } = require("../controller/user.controller");
const loginLimiter = require("../middleware/login.limit");
const router = express.Router();

router.post('/signup', signup);
router.get('/login', loginLimiter, login);
router.patch('/admin/:userId', admin);
router.patch('/change-password/:userId', changePassword);
router.patch('/forgot-password', forgotPassword);
router.patch('/otp-verify', verifyOtp);
router.patch('/reset-password/:userId', resetPassword);
router.post('/verify-email/:emailToken', verifyEmail);

module.exports = router;