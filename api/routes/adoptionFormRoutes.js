const adoptionFormController = require('../controllers/adoptionFormController');
const express = require('express');
const router = express.Router();

router.get('/', adoptionFormController.AdoptionFormGetAll);
router.get('/:adoptionId', adoptionFormController.AdoptionFormGetOne);
router.post('/', adoptionFormController.addAdoptionForm);
router.put('/:adoptionId', adoptionFormController.editAdoptionForm);
router.delete('/:adoptionId', adoptionFormController.deleteAdoptionForm);

module.exports = router;