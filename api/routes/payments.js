const express = require('express');
const router = express.Router();
const paymentControllers = require('../controllers/payments');
const auth = require('../middleware/authorization');

//ALL
router.post('/', paymentControllers.makeAPayment);
//LOGGED USER PAYMENT
router.post('/me', auth.loggedUser, paymentControllers.paymentsPostMe);
//ADMIN
router.get(
  '/',
  // [auth.loggedUser, auth.isAdmin],
  paymentControllers.getAllPayments
);
router.get(
  '/:id',
  [auth.loggedUser, auth.isAdmin],
  paymentControllers.getOnePayment
);
router.delete(
  '/:id',
  [auth.loggedUser, auth.isAdmin],
  paymentControllers.deleteOnePayment
);
router.put(
  '/:id',
  [auth.loggedUser, auth.isAdmin],
  paymentControllers.updateOnePayment
);
router.patch(
  '/:id',
  [auth.loggedUser, auth.isAdmin],
  paymentControllers.updateOnePropertyInPayment
);

module.exports = router;
