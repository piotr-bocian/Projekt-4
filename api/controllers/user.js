const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');


exports.usersGetAll = async(req, res, next) => {
    const users = await User.find().sort('lastName');
    res.send(users);
};

exports.usersGetUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(isIdValid){
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).send('Użytkownik o podanym ID nie istnieje.');
        res.send(user);
    }else {
        res.status(400).send('Podano nieprawidłowy numer id');
    }    
};

exports.usersAddUser = async(req, res, next) => {
    try{
        const { firstName, lastName, email, password, mobile, image, isAdmin, isVolunteer } = req.body;
        const validUser = await validateUser.validateAsync(req.body);
        let user = await User.findOne({ email: req.body.email });
        if(user) return res.status(400).send('Użytkownik o podanym adresie email jest już zarejestrowany.');

        user = new User({
            ...validUser
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();
        res.send({
            message: 'Rejestracja przebiegła pomyślnie',
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } catch (error) {
        res.status(400).send(error.message);
    }

};
