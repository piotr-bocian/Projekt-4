const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const Joi = require('joi');
const { ValidationError } = require('joi');

const userCompanySchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Property email should be a valid email'] //email address regex validation
    },
    password: { 
        type: String, 
        required: true,
        // match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'Property password should contain at least 1 digit, 1 lowercase, 1 uppercase and should be at least 8 characters long'] // 1 digit, 1 lower, 1 upper case, min 8 characters
        //password validation:
        // ^ - symbol indicates that regex is for password,
        // (?=.*\d) - should contain at least one digit
        // (?=.*[a-z]) - should contain at least one lower case
        //(?=.*[A-Z]) - should contain at least one upper case
        // [0-9a-zA-Z]{8,} - should contain at least 8 from the mentioned characters
        // $ - force the matching to be only valid if can be applied until string termination
    },
    nip: { 
        type: String,
        minLength: 10,
        maxLength: 10, 
        required: true 
    },
    companyName: { 
        type: String, 
        required: true, 
        minLength: 2, 
        maxLength: 255 
    },
    street: { 
        type: String, 
        required: true, 
        minLength: 2, 
        maxLength: 100 
    },
    houseNo: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true, 
        minLength: 2, 
        maxLength: 50 
    },
    postcode: { 
        type: String, 
        required: true, 
        minLength: 6, 
        maxLength: 6 
    },
    mobile: { 
        type: String, 
        required: true,
        minLength: 11,
        maxLength: 15,
        match: [/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/, 'Property mobile should match a pattern: +12 123-456-789 or 123-456-789']
        // mobile no pattern: +48 123-456-789, or 123-456-789
    },
    image: {
        type: String
    }
});

userCompanySchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        // isAdmin: this.isAdmin,
        // isVolunteer: this.isVolunteer
    },
    process.env.SCHRONISKO_JWT_PRIVATE_KEY,
    {
        expiresIn: "1h"
    });
    return token;
}

const UserCompany = mongoose.model('UserCompany', userCompanySchema);

const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).required(),
    nip: Joi.string().length(10).required(),
    companyName: Joi.string().min(2).max(255).required(),
    street: Joi.string().min(2).max(100).required(),
    houseNo: Joi.string().required(),
    city: Joi.string().min(2).max(50).required(),
    postcode: Joi.string().length(6).required(),
    mobile: Joi.string().min(11).max(15).regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/).required(),
    image: Joi.binary().encoding('base64').max(5*1024*1024) //image size validation 5MB
});

const patch = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
    nip: Joi.string().length(10),
    companyName: Joi.string().min(2).max(255),
    street: Joi.string().min(2).max(100),
    houseNo: Joi.string(),
    city: Joi.string().min(2).max(50),
    postcode: Joi.string().length(6),
    mobile: Joi.string().min(11).max(15).regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/),
    image: Joi.binary().encoding('base64').max(5*1024*1024) //image size validation 5MB
});

exports.UserCompany = UserCompany;
exports.validateUserCompany = schema;
exports.validatePatchUpdate = patch;