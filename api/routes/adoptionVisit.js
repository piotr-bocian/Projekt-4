const express = require('express');
const router = express.Router();
const visitControllers = require('../controllers/adoptionVisit');

router.get('/', visitControllers.getAllVisits);
router.get('/:id', visitControllers.getVisit);
router.post('/', visitControllers.makeVisit);
router.delete('/:id', visitControllers.deleteVisit);
router.put('/:id', visitControllers.updateVisit);

module.exports = router;