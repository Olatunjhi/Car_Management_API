const express = require("express");
const { signup, login } = require("../controller/user.controller");
const router = express.Router();

router.post('/singup', signup);
router.get('/login', login);

module.exports = router;