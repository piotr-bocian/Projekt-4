const mongoose = require('mongoose');
const { User, validate } = require('../models/user');


exports.usersGetAll = async(req, res, next) => {
    const users = await User.find().sort('lastName');
    res.send(users);
    next();
};

exports.usersGetUser = async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('Użytkownik o podanym ID nie istnieje.');
    
    res.send(user);
    next();
};