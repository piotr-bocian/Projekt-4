const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const Joi = require('joi');
const { ValidationError } = require('joi');


const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstName: {
        type: String,
        required: true,
        minLength: 2, 
        maxLength: 50,
        match: [/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/, 'Pole imię musi zawierać tylko litery']
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2, 
        maxLength: 50,
        match: [/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/, 'Pole nazwisko musi zawierać tylko lietery']
    },
    email: { 
        type: String, 
        minLength: 5,
        maxLength: 255,
        required: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Podano nieprawidłowy adres email']
    },
    password: { 
        type: String, 
        required: true,
        minLength: 8,
        maxLength: 1024,
        // I had to comment the match property because, after hash, password did not matched a pattern
        // match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z<>!@#$%^&*?_=+-]{8,}$/, 'Hasło musi składać się z przynajmniej 8 znaków, zawierać 1 cyfrę, 1 małą i 1 dużą literę.'] // 1 digit, 1 lower, 1 upper case, min 8 characters
        //password validation:
        // ^ - symbol indicates that regex is for password,
        // (?=.*\d) - should contain at least one digit
        // (?=.*[a-z]) - should contain at least one lower case
        //(?=.*[A-Z]) - should contain at least one upper case
        // [0-9a-zA-Z]{8,} - should contain at least 8 from the mentioned characters
        // $ - force the matching to be only valid if can be applied until string termination
    },
    mobile: { 
        type: String, 
        required: true,
        minLength: 11,
        maxLength: 15,
        match: [/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/, 'Numer telefonu należy wpisać wg. wzoru: +12 123-456-789 lub 123-456-789']
        // mobile no pattern: +48 123-456-789, or 123-456-789
    },
    image: {
        type: Buffer.from('base64')
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVolunteer: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        isAdmin: this.isAdmin,
        isVolunteer: this.isVolunteer,
        isSuperAdmin: this.isSuperAdmin
    },
    process.env.SCHRONISKO_JWT_PRIVATE_KEY,
    {
        expiresIn: "1h"
    });
    return token;
}

const User = mongoose.model('User', userSchema);
//.regex(/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/)

const newUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).regex(/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z<>!@#$%^&*?_=+-]{8,}$/).required(),
    mobile: Joi.string().min(11).max(15).regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/).required(),
    image: Joi.binary().encoding('base64').max(5*1024*1024), //image size validation 5MB
    isAdmin: Joi.boolean(),
    isVolunteer: Joi.boolean(),
    isSuperAdmin: Joi.boolean()
});

const updateUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).regex(/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/),
    lastName: Joi.string().min(2).max(50).regex(/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(8).max(255).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z<>!@#$%^&*?_=+-]{8,}$/),
    mobile: Joi.string().min(11).max(15).regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/),
    image: Joi.binary().encoding('base64').max(5*1024*1024), //image size validation 5MB
    isAdmin: Joi.boolean(),
    isVolunteer: Joi.boolean(),
    isSuperAdmin: Joi.boolean()
});

exports.User = User;
exports.validateUser = newUserSchema;
exports.validatePatchUpdate = updateUserSchema;