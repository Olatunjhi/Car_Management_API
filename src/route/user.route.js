const express = require("express");
const { signup, login, admin, changePassword } = require("../controller/user.controller");
const router = express.Router();

router.post('/signup', signup);
router.get('/login', login);
router.patch('/admin/:userId', admin);
router.patch('/change-password', changePassword)

module.exports = router;