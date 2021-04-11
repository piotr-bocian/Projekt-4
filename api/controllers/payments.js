const mongoose = require('mongoose');
const {
  Payment,
  validatePayment,
  validatePatchUpdate,
} = require('../models/paymentSchema');

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
  //search engine
  let search;
  const term = req.query.search;
  if (term) {
    search = {
      $text: { $search: term },
    };
  }

  results.results = await Payment.find(search || req.query || req.params)
    .limit(limit)
    .skip(startIndex)
    .sort({ amount: -1 });
  res.send({
    request: {
      type: 'GET',
      description: 'Get all payments',
      url: 'http://localhost:3000/api/payments/',
    },
    payments: results,
  });
};

exports.getOnePayment = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).send('Płatność, której szukasz nie istnieje');
    }

    res.send({
      request: {
        type: 'GET',
        description: 'Get all payments',
        url: 'http://localhost:3000/api/payments/',
      },
      payment,
    });
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
    payment = new Payment({
      _id: mongoose.Types.ObjectId(),
      ...value,
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

exports.paymentsPostMe = async (req, res, next) => {
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
      userID: req.user._id,
    });
    payment = await payment.save();
    res.status(201).send({
      message: 'Twoja płatność przebiegła pomyślnie',
      payment,
    });
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};

exports.deleteOnePayment = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const payment = await Payment.findByIdAndRemove(req.params.id);

    if (!payment) {
      return res.status(404).send('Płatność, której szukasz nie istnieje');
    }

    res.status(202).send({
      message: 'Płatność została poprawnie usunieta z bazy danych',
      payment,
      request: {
        type: 'DELETE',
        description: 'To see all payments go to:',
        url: 'http://localhost:3000/api/payments/',
      },
    });
  } else {
    res.status(400).send('Podano błędny numer _id');
  }
};

exports.updateOnePayment = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) {
    res.status(400).send('Podano błędny numer _id');
    return;
  }
  try {
    const { typeOfPayment, amount, paymentDate, paymentMethod } = req.body;
    await validatePayment.validateAsync({
      typeOfPayment,
      amount,
      paymentDate,
      paymentMethod,
    });

    let payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        typeOfPayment,
        amount,
        paymentDate,
        paymentMethod,
      },
      { new: true }
    );
    res.status(200).send({
      message: 'Zaktualizowana płatność',
      payment,
      request: {
        type: 'PUT',
        description: 'To see all payments go to:',
        url: 'http://localhost:3000/api/payments/',
      },
    });
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};

exports.updateOnePropertyInPayment = async (req, res) => {
  const id = req.params.id;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    res.status(400).send('Podano błędny numer _id');
    return;
  }
  try {
    const updatePayment = {};
    for (const update of req.body) {
      updatePayment[update.propertyName] = update.newValue;
    }
    await validatePatchUpdate.validateAsync(updatePayment);
    const payment = await Payment.findOneAndUpdate(
      { _id: id },
      { $set: updatePayment },
      { new: true }
    );
    res.status(200).send({
      message: `Zaktualizowano nastepujące pola ${JSON.stringify(
        updatePayment
      )}`,
      payment,
      request: {
        type: 'PATCH',
        description: 'To see all payments go to:',
        url: 'http://localhost:3000/api/payments/',
      },
    });
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};
