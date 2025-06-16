const express = require("express");
const { signup, login, admin } = require("../controller/user.controller");
const router = express.Router();

router.post('/signup', signup);
router.get('/login', login);
router.patch('/admin/:userId', admin);

module.exports = router;