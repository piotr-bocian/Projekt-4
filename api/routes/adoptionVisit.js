const auth = require('../middleware/authorization');
const express = require('express');
const router = express.Router();
const visitControllers = require('../controllers/adoptionVisit');

// User GET visit, User DELETE visist, User PUT visit ???
// Admin GET all visits and visit by id 
router.get('/', [auth.loggedUser, auth.isAdmin], visitControllers.getAllVisits);
router.get('/:id', [auth.loggedUser, auth.isAdmin],visitControllers.getVisit);
// User POST visit
router.post('/me', auth.loggedUser, visitControllers.makeMyVisit);
// Admin POST visit
router.post('/', [auth.loggedUser, auth.isAdmin], visitControllers.makeVisit);
// Admin DELETE visit by id
router.delete('/:id', [auth.loggedUser, auth.isAdmin], visitControllers.deleteVisit);
// Admin update visit by id
router.put('/:id', [auth.loggedUser, auth.isAdmin], visitControllers.updateVisit);

module.exports = router;