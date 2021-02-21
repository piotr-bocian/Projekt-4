const mongoose = require('mongoose');

const userCompanySchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ //email address regex validation
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
    nip: { 
        type: String, 
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
        maxLength: 50 
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
        match: /^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/
        // mobile no pattern: +48 123-456-789, or 123-456-789
    },
});

const UserCompany = mongoose.model('UserCompany', userCompanySchema)

exports = UserCompany;