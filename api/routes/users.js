const auth = require('../middleware/authorization');
const { User, validateUser } = require('../models/user');
const userController = require('../controllers/user');
const { upload } = require('../middleware/upload')
const express = require('express');
const router = express.Router();
const mail = require('../middleware/mail');


router.get('/me', auth.loggedUser, userController.usersGetMe);
router.get('/', [auth.loggedUser ,auth.isAdmin], userController.usersGetAll);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], userController.usersGetUser);
router.post('/', userController.usersAddUser,mail.registrationMail);
router.post('/addEmployee', [auth.loggedUser, auth.isSuperAdmin], userController.usersAddEmployee,mail.registrationMail);
router.patch('/me', auth.loggedUser, userController.usersUpdateMe);
router.patch('/:id', [auth.loggedUser, auth.isAdmin], userController.usersUpdateUser);
router.delete('/me', auth.loggedUser, userController.usersDeleteMe);
router.delete('/:id', [auth.loggedUser, auth.isAdmin], userController.usersDeleteUser);


module.exports = router;