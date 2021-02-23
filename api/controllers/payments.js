const mongoose = require('mongoose');
const { Payment, validatePayment } = require('../models/paymentSchema');

exports.getAllPayments = async (req, res) => {
  const payment = await Payment.find().sort({ amount: -1 });
  res.send(payment);
};

// JOI can't validate id. Except for these exceptions get and post and validation work fine.
exports.makeAPayment = async (req, res) => {
  try {
    const value = await validatePayment.validateAsync({
      typeOfPayment: req.body.typeOfPayment,
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      paymentMethod: req.body.paymentMethod,
      // userId: req.body.userIdm,
      // userCompanyId: req.body.userCompanyId,
    });
    let payment = new Payment(value);
    payment = await payment.save();
    res.status(201).send(payment);
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};
