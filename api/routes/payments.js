const express = require('express');
const router = express.Router();
const paymentControllers = require('../controllers/payments');
const auth = require('../middleware/authorization');
router.get(
  '/',
  [auth.loggedUser, auth.isAdmin],
  paymentControllers.getAllPayments
);
router.get('/:id', auth.loggedUser, paymentControllers.getOnePayment);
router.post('/', paymentControllers.makeAPayment);
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
