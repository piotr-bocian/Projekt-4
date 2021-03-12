const adoptionFormController = require('../controllers/adoptionFormController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');

router.get('/', adoptionFormController.AdoptionFormGetAll);
router.get('/:adoptionId', adoptionFormController.AdoptionFormGetOne);
router.post('/', auth.loggedUser, adoptionFormController.addAdoptionForm);
router.put('/:adoptionId', [auth.loggedUser, auth.isAdmin], adoptionFormController.editAdoptionForm);
router.delete('/:adoptionId',[auth.loggedUser, auth.isAdmin], adoptionFormController.deleteAdoptionForm);

module.exports = router;