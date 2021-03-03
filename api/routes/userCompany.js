const auth = require('../middleware/authorization');
const { UserCompany, validateUserCompany } = require('../models/userCompany');
const userCompanyController = require('../controllers/userCompany');
const express = require('express');
const router = express.Router();


router.get('/me', auth.loggedUser, userCompanyController.userCompanyGetMe);
router.get('/', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyGetAll);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyGetUser);
router.post('/', userCompanyController.userCompanyAddUser);

module.exports = router;