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
        match: [/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/, 'Property firstName must contain only letters']
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2, 
        maxLength: 50,
        match: [/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,50}$/, 'Property lastName must contain only letters']
    },
    email: { 
        type: String, 
        minLength: 5,
        maxLength: 255,
        required: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Property email should be a valid email']
    },
    password: { 
        type: String, 
        required: true,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'Property password should contain at least 1 digit, 1 lowercase, 1 uppercase and should be at least 8 characters long'] // 1 digit, 1 lower, 1 upper case, min 8 characters
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
        match: [/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/, 'Property mobile should match a pattern: +12 123-456-789 or 123-456-789']
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
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).required(),
        mobile: Joi.string().min(11).max(15).regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/).required(),
        image: Joi.binary().encoding('base64').max(5*1024*1024), //image size validation 5MB
        isAdmin: Joi.boolean(),
        isVolunteer: Joi.boolean()
    });

    // with this approach "Joi.validate is not a function" error does not occur
    const validate = schema.validateAsync(user);
    // console.log(validate);
    return validate;
}

// example of how to validate mongoose schema with joi
// const testUser = new User({
//     firstName: '',
//     lastName: 'Kowalski',
//     email: 'k.kowalski@gmail.com',
//     password: 'Kkowals1',
//     mobile: '+48 123-456-789',
//     image: 'hello img',
//     isAdmin: true,
//     isVolunteer: false
// });

// new mongoose object has to be converted into POJO - Plain Old JavaScript Object with
// mongoose's toObject() method to make it possible to validate it with Joi, as shown below.

// const testVal = validateUser(testUser.toObject());
// if(testVal.error) {
//     console.log(testVal);
// }else {
//     console.log(testVal);
// };


exports.User = User;
exports.validateUser = validateUser;