const auth = require('../middleware/authorization');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User, validateUser, validatePatchUpdate } = require('../models/user');

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
        if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');
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
    id = req.user._id;
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if(!isIdValid){
        return res.status(400).send('Podano błędny numer id.');
    }
    let user = await User.findById(req.user._id)
    if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');

    try {
        const updateUser = {}
        for (const update of req.body) {
            updateUser[update.propertyName] = update.newValue;
        };
        await validatePatchUpdate.validateAsync(updateUser);
        if (req.body[0].propertyName === 'password') {
            const salt = await bcrypt.genSalt(10);
            updateUser.password = await bcrypt.hash(updateUser.password, salt);
        };
        user = await User.findOneAndUpdate(
            { _id: id },
            { $set: updateUser},
            { new: true }
        );
        res.status(200).send({
            message: `Zaktualizowano następujące pola: ${JSON.stringify(user)}`
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.usersUpdateMe = async(req, res, next) => {
    id = req.params._id;
    let user = await User.findById(req.user._id)
    if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');
    
    try {
        const updateUser = {};
        console.log(req.body);
        //it throws an error req.body is not iterable
        for (const update of req.body) {
            updateUser[update.propertyName] = update.newValue;
        };
        await validatePatchUpdate.validateAsync(updateUser);
        if (req.body[0].propertyName === 'password') {
            const salt = await bcrypt.genSalt(10);
            updateUser.password = await bcrypt.hash(updateUser.password, salt);
        };
        user = await User.findOneAndUpdate(
            { _id: id },
            { $set: updateUser},
            { new: true }
        );
        res.status(200).send({
            message: `Zaktualizowano następujące pola: ${JSON.stringify(user)}`
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.usersDeleteMe = async(req, res, next) => {
    const user = await User.findByIdAndRemove(req.user._id).select('-password');
    if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');

    res.status(202).send({
        message: 'Konto zostało poprawnie usunięte',
        user
    });
}

exports.usersDeleteUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isIdValid){
        return res.status(400).send('Podano błędny numer id.');
    }

    let user = await User.findByIdAndRemove(req.params.id);

    if(!user){
        return res.status(404).send('Podany użytkownik nie istnieje.');
    }

    res.status(202).send({
        message: 'Pomyślnie usunięto konto użytkownika.',
        user
    });
}
