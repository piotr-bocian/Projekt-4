const mongoose = require('mongoose');
const Joi = require('joi');
const { Db } = require('mongodb');

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
//index wildcard allow to dynamic search
paymentSchema.index({'$**': 'text'});
const Payment = mongoose.model('Payment', paymentSchema);

//validation is an object that return value or error
const schema = Joi.object({
  typeOfPayment: Joi.string()
    .valid(
      'opłata adopcyjna',
      'jednorazowy przelew',
      'wirtualny opiekun-opłata cykliczna'
    )
    .required(),
  amount: Joi.number().min(5).required(),
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

const patch = Joi.object({
  typeOfPayment: Joi.string().valid(
    'opłata adopcyjna',
    'jednorazowy przelew',
    'wirtualny opiekun-opłata cykliczna'
  ),
  amount: Joi.number().min(5),
  paymentDate: Joi.date().min('now'),
  paymentMethod: Joi.string().valid(
    'Karta płatnicza',
    'Blik',
    'Przelew bankowy',
    'Apple Pay',
    'Google Pay'
  ),
});

exports.Payment = Payment;
exports.validatePayment = schema;
exports.validatePatchUpdate = patch;
