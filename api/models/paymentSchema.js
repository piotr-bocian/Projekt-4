const mongoose = require('mongoose');
const Joi = require('joi');

const paymentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  typeOfPayment: {
    type: String,
    enum: [
      'opłata adopcyjna',
      'jednorazowy przelew',
      'wirtualny opiekun-opłata cykliczna',
    ],
    required: true,
  },
  amount: {
    type: Number,
    min: 5,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: [
      'Karta płatnicza',
      'Blik',
      'Przelew bankowy',
      'Apple Pay',
      'Google Pay',
    ],
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userCompanyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCompany',
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

function validatePayment(payment) {
  const schema = Joi.object({
    typeOfPayment: Joi.string()
      .valid(
        'opłata adopcyjna',
        'jednorazowy przelew',
        'wirtualny opiekun-opłata cykliczna'
      )
      .required(),
    amount: Joi.string().min(5).required(),
    paymentDate: Joi.date().min('now'),
    paymentMethod: Joi.string()
      .valid(
        'Karta płatnicza',
        'Blik',
        'Przelew bankowy',
        'Apple Pay',
        'Google Pay'
      )
      .required(),
  });

  return Joi.validate(payment, schema);
}

exports.Payment = Payment;
exports.validatePayment = validatePayment;
