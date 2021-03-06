const express = require('express');
const router = express.Router();
const paymentControllers = require('../controllers/payments');
const auth = require('../middleware/authorization');

//ALL
router.post('/', paymentControllers.makeAPayment);
//USER
router.get('/me', auth.loggedUser, paymentControllers.paymentsGetMe);
//ADMIN
router.get(
  '/',
  [auth.loggedUser, auth.isAdmin],
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
