const { User, validateUser } = require('../models/user');
const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res, next) => {
    const users = await User.find().sort('lastName');
    console.log(users);
    res.send(users);
    next();
});


module.exports = router;