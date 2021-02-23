const mongoose = require('mongoose');
const { Payment, validatePayment } = require('../models/paymentSchema');

exports.getAllPayments = async (req, res) => {
  const payment = await Payment.find().sort({ amount: -1 });
  res.send(payment);
};

exports.getOnePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment)
    return res.status(404).send('Płatność, której szukasz nie istnieje');

  res.send(payment);
};

exports.makeAPayment = async (req, res) => {
  try {
    const value = await validatePayment.validateAsync({
      typeOfPayment: req.body.typeOfPayment,
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      paymentMethod: req.body.paymentMethod,
    });
    let payment = new Payment({
      _id: mongoose.Types.ObjectId(),
      ...value,
      //not work or it will be added automatically by a logged user???
      userId: req.body.userId,
      userCompanyId: req.body.userCompanyId,
    });
    payment = await payment.save();
    res.status(201).send({
      message: "Płatność przebiegła pomyślnie",
      payment});
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};
