const auth = require('../middleware/authorization');
const { upload } = require('../middleware/upload')
const { UserCompany, validateUserCompany } = require('../models/userCompany');
const userCompanyController = require('../controllers/userCompany');
const express = require('express');
const router = express.Router();


router.get('/me', auth.loggedUser, userCompanyController.userCompanyGetMe);
router.get('/', [auth.loggedUser ,auth.isAdmin], userCompanyController.usersGetAll);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyGetUser);
router.post('/', upload.single('image'), userCompanyController.userCompanyAddUser);
router.delete('/me', auth.loggedUser, userCompanyController.userCompanyDeleteMe);
router.delete('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyDeleteUser);
router.patch('/me', auth.loggedUser, userCompanyController.userCompanyUpdateMe);
router.patch('/:id', [auth.loggedUser ,auth.isAdmin], userCompanyController.userCompanyUpdateUser);

module.exports = router;