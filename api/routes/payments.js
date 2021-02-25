const express = require('express');
const router = express.Router();
const paymentControllers = require('../controllers/payments');

router.get('/', paymentControllers.getAllPayments);
router.get('/:id', paymentControllers.getOnePayment);
router.post('/', paymentControllers.makeAPayment);
router.delete('/:id', paymentControllers.deleteOnePayment);
router.put('/:id', paymentControllers.updateOnePayment);

module.exports = router;
