const express = require('express');
const isAuthentication = require('../middleware/isAuth');
const { carRentCheckoutPayment } = require('../controller/rental.controller');
const { flutterwaveWebhook } = require('../controller/flw.webhook');
const router = express.Router();

router.post('/rent', isAuthentication, carRentCheckoutPayment);
router.post('/flutterwave-webhook', flutterwaveWebhook);

module.exports = router;
// This file sets up the routes for car rental orders and payment processing using Flutterwave.