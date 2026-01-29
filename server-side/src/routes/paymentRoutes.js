const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/pay', paymentController.initiatePayment.bind(paymentController));
router.get('/status/:transactionId', paymentController.getStatus.bind(paymentController));
router.get('/transactions', paymentController.getTransactions.bind(paymentController));

module.exports = router;