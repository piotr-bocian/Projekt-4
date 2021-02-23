const express = require('express');
const router = express.Router();
const paymentControllers = require('../controllers/payments');


router.get('/', paymentControllers.getAllPayments);
router.post('/', paymentControllers.makeAPayment);

module.exports = router;
