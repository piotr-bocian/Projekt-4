const mongoose = require('mongoose');

const userCompanySchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { 
        type: String, 
        required: true 
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
        minLength: 9
    },
});

module.exports = mongoose.model('UserCompany', userCompanySchema);