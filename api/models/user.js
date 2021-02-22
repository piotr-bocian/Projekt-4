const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstName: {
        type: String,
        required: true,
        minLength: 3, 
        maxLength: 50 
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3, 
        maxLength: 50
    },
    email: { 
        type: String, 
        minLength: 5,
        maxLength: 255,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String, 
        required: true,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/ // 1 digit, 1 lower, 1 upper case, min 8 characters
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
        match: /^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/
        // mobile no pattern: +48 123-456-789, or 123-456-789
    },
    image: {
        type: String
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

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).required(),
        mobile: Joi.string().min(11).max(15).regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/).required(),
        image: Joi.binary().encoding('base64').max(5*1024*1024) //image size validation 5MB
    });

    // const validation = schema.validate(user);

    return Joi.validate(user, schema);
}

module.exports = User;
module.exports = validateUser;