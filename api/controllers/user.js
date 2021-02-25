const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');


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
    try{
        const { error } = await validateUser.validateAsync(req.body);
        let user = await User.findOne({ email: req.body.email });
        if(user) return res.status(400).send('Użytkownik o podanym adresie email jest już zarejestrowany.');

        user = new User({
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
        res.send({
            message: 'Rejestracja przebiegła pomyślnie',
            user
        });
    } catch (error) {
        res.status(400).send(error.details[0].message);
    }

};