const auth = require('../middleware/authorization');
const { User, validateUser } = require('../models/user');
const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();


router.get('/me', auth.loggedUser, userController.usersGetMe);
router.get('/', [auth.loggedUser ,auth.isAdmin], userController.usersGetAll);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], userController.usersGetUser);
router.post('/', userController.usersAddUser);
router.delete('/me', auth.loggedUser, userController.usersDeleteMe);
router.delete('/:id', [auth.loggedUser, auth.isAdmin], userController.usersDeleteUser);


module.exports = router;