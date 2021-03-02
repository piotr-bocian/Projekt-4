const auth = require('../middleware/authorization');
const { User, validateUser } = require('../models/user');
const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();


router.get('/me', auth.loggedUser, userController.usersGetMe);
router.get('/', [auth.loggedUser ,auth.isAdmin], userController.usersGetAll);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], userController.usersGetUser);
//don't know why cannot change endpoint addres to /rejestracja.
router.post('/', userController.usersAddUser);

module.exports = router;