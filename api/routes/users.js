const { User, validateUser } = require('../models/user');
const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();


router.get('/', userController.usersGetAll);
router.get('/:id', userController.usersGetUser);
//don't know why cannot change endpoint addres to /rejestracja.
router.post('/', userController.usersAddUser);

module.exports = router;