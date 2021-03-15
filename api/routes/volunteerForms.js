const volunteerFormController = require('../controllers/volunteerForm');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');

router.get('/', [auth.loggedUser, auth.isAdmin], volunteerFormController.VolunteerFormGetAll);
router.get('/:id', [auth.loggedUser, auth.isAdmin], volunteerFormController.VolunteerFormGetOne);
router.post('/', auth.loggedUser, volunteerFormController.addVolunteerForm);
router.patch('/:id', [auth.loggedUser, auth.isAdmin], volunteerFormController.updateVolunteerFormProperty);
router.delete('/:id', [auth.loggedUser, auth.isAdmin], volunteerFormController.deleteVolunteerForm);

module.exports = router;