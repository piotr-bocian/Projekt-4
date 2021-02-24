const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) => {
    const users = await User.find().sort('lastName');
    res.send(users);
});