const auth = require('../middleware/authorization');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');

exports.usersGetMe = async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(404).send('Użytkownik o podanym id nie istnieje.');

    res.send(user);
}

exports.usersGetAll = async(req, res, next) => {
    const users = await User.find().select('-password').sort('lastName');
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
            _id: new mongoose.Types.ObjectId(),
            ...validUser
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send({
            message: 'Rejestracja przebiegła pomyślnie',
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } catch (error) {
        res.status(400).send(error.message);
    }

};

exports.usersUpdateUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isIdValid){
        return res.status(400).send('Podano błędny numer id.');
    }


}

exports.usersDeleteUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isIdValid){
        return res.status(400).send('Podano błędny numer id.');
    }

    let user = await User.findByIdAndRemove(req.params.id);

    if(!user){
        return res.status(404).send('Podany użytkownik nie istnieje');
    }

    res.status(202).send({
        message: 'Pomyślnie usunięto konto użytkownika.',
        user
    });
}
