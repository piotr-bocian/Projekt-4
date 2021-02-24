const mongoose = require('mongoose');
const { Payment, validatePayment } = require('../models/paymentSchema');

exports.getAllPayments = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    allPaymentsInDatabase: await Payment.count(),
  };
  if (endIndex < (await Payment.count())) {
    results.next = {
      page: `/api/payments?page=${page + 1}&limit=${limit}`,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: `/api/payments?page=${page - 1}&limit=${limit}`,
      limit: limit,
    };
  }
  results.results = await Payment.find()
    .limit(limit)
    .skip(startIndex)
    .sort({ amount: -1 });
  res.send({
    product: results,
    request: {
      type: 'GET',
      description: 'Get all payments',
      url: 'http://localhost:3000/api/payments/',
    },
  });
};

exports.getOnePayment = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).send('Płatność, której szukasz nie istnieje');
    }

    res.send(payment);
  } else {
    res.status(400).send('Podano błędny numer _id');
  }
};

exports.makeAPayment = async (req, res) => {
  try {
    const { typeOfPayment, amount, paymentDate, paymentMethod } = req.body;
    const value = await validatePayment.validateAsync({
      typeOfPayment,
      amount,
      paymentDate,
      paymentMethod,
    });
    let payment = new Payment({
      _id: mongoose.Types.ObjectId(),
      ...value,
      userID: req.body.userID,
      userCompanyID: req.body.userCompanyID,
    });
    payment = await payment.save();
    res.status(201).send({
      message: 'Płatność przebiegła pomyślnie',
      payment,
    });
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};
