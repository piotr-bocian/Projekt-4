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
        minLength: 5, 
        maxLength: 20
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

module.exports = mongoose.model('User', userSchema);