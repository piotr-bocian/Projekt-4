const volunteerFormController = require('../controllers/volunteerForm');
const express = require('express');
const router = express.Router();

router.get('/', volunteerFormController.VolunteerFormGetAll);
router.get('/:id', volunteerFormController.VolunteerFormGetOne);
router.post('/', volunteerFormController.addVolunteerForm);
router.patch('/:id', volunteerFormController.updateVolunteerFormProperty);
router.delete('/:id', volunteerFormController.deleteVolunteerForm);

module.exports = router;