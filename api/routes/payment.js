const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Payment, validatePayment } = require('../models/paymentSchema');

router.get('/', async (req, res) => {
  const payment = await Payment.find().sort('amount');
  res.send(payment);
});


//there is a problem with joi validate function
router.post('/', async (req, res) => {
  // const { error } = validatePayment(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const payment = new Payment({
    _id: mongoose.Types.ObjectId(),
    typeOfPayment: req.body.typeOfPayment,
    amount: req.body.amount,
    paymentDate: req.body.paymentDate,
    paymentMethod: req.body.paymentMethod,
    userId: req.body.userIdm,
    userCompanyId: req.body.userCompanyId,
  });
  paymant = await payment.save();

  res.status(200).send(payment);
});

module.exports = router;
