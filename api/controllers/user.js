const mongoose = require('mongoose');
const { User, validate } = require('../models/user');


exports.usersGetAll = async(req, res, next) => {
    const users = await User.find().sort('lastName');
    res.send(users);
};

exports.usersGetUser = async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('Użytkownik o podanym ID nie istnieje.');
    
    res.send(user);
};

exports.usersAddUser = async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        image: req.body.image,
        isAdmin: req.body.isAdmin,
        isVolunteer: req.body.isVolunteer
    });
    
    user = await user.save();
    
    res.send(user);

};