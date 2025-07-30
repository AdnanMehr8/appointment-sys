const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-session', paymentController.createPaymentSession);
router.post('/webhook', paymentController.mockWebhook); // simulating a webhook

module.exports = router;
