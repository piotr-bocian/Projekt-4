const adoptionFormController = require('../controllers/adoptionFormController');
const express = require('express');
const router = express.Router();

router.get('/', adoptionFormController.AdoptionFormGetAll);
router.get('/:id', adoptionFormController.AdoptionFormGetOne);
router.post('/', adoptionFormController.addAdoptionForm);

module.exports = router;