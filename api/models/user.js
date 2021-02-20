const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
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
        // $ - ending ofregex
    },
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
    mobile: { 
        type: String, 
        required: true,
        minLength: 9 
    },
    isAdmin: Boolean,
    isVolunteer: Boolean
});

const User = mongoose.model('User', userSchema);

exports = User;