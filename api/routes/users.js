const { User, validateUser } = require('../models/user');
const UserController = require('../controllers/user');
const express = require('express');
const router = express.Router();


router.get('/', UserController.getUsers);


module.exports = router;