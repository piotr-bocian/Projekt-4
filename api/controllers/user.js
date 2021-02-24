const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');


exports.getUsers = async (req, res, next) => {
    const users = await User.find().sort('lastName');
    res.send(users);
};