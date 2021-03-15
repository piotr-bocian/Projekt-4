const auth = require('../middleware/authorization');
const express = require('express');
const router = express.Router();
const visitControllers = require('../controllers/adoptionVisit');

// User:
router.get('/me', auth.loggedUser, visitControllers.getMyVisits);
router.get('/me/:id', auth.loggedUser, visitControllers.getMyVisit);
router.post('/me', auth.loggedUser, visitControllers.makeMyVisit);
router.delete('/me/:id', auth.loggedUser, visitControllers.deleteMyVisit);
router.patch('/me/:id', auth.loggedUser, visitControllers.updateMyVisit);

// Admin:
router.get('/', [auth.loggedUser, auth.isAdmin], visitControllers.getAllVisits);
router.get('/:id', [auth.loggedUser, auth.isAdmin],visitControllers.getVisit);
router.post('/', [auth.loggedUser, auth.isAdmin], visitControllers.makeVisit);
router.delete('/:id', [auth.loggedUser, auth.isAdmin], visitControllers.deleteVisit);
router.put('/:id', [auth.loggedUser, auth.isAdmin], visitControllers.updateVisit);

module.exports = router;