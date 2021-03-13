const mongoose = require('mongoose');
const Joi = require('joi');

const paymentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  typeOfPayment: {
    type: String,
    enum: [
      'Opłata adopcyjna',
      'Jednorazowy przelew',
      'Wirtualny opiekun-opłata cykliczna',
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
    type: String,
    ref: 'User',
  },
});
//index wildcard allow to dynamic search
paymentSchema.index({ '$**': 'text' });
const Payment = mongoose.model('Payment', paymentSchema);

//validation is an object that return value or error
const schema = Joi.object({
  typeOfPayment: Joi.string()
    .valid(
      'Opłata adopcyjna',
      'Jednorazowy przelew',
      'Wirtualny opiekun-opłata cykliczna',
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
    'Opłata adopcyjna',
    'Jednorazowy przelew',
    'Wirtualny opiekun-opłata cykliczna',
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
