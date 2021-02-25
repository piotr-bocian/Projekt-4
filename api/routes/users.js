const { User, validate } = require('../models/user');
const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();


router.get('/', userController.usersGetAll);
router.get('/:id', userController.usersGetUser);
router.post('/', userController.usersAddUser);


module.exports = router;