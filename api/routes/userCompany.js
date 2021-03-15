const auth = require('../middleware/authorization');
const { upload } = require('../middleware/upload')
const { UserCompany, validateUserCompany } = require('../models/userCompany');
const userCompanyController = require('../controllers/userCompany');
const express = require('express');
const router = express.Router();

// USER
router.get('/me', auth.loggedUser, userCompanyController.userCompanyGetMe);
router.delete('/me', auth.loggedUser, userCompanyController.userCompanyDeleteMe);
router.patch('/me', auth.loggedUser, userCompanyController.userCompanyUpdateMe);
// ADMIN
router.get('/', [auth.loggedUser ,auth.isAdmin], userCompanyController.usersGetAll);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyGetUser);
router.delete('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyDeleteUser);
router.patch('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyUpdateUser);
// EVERYONE
router.post('/', userCompanyController.userCompanyAddUser);


module.exports = router;