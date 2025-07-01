const loginLimit = require("express-rate-limit");

const loginLimiter = loginLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "To many attempt from this IP. Please try again later"
})

module.exports = loginLimiter