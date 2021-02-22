const mongoose = require('mongoose');
const Joi = require('joi');


//ADOPTION VISIT SCHEMA

const adoptionVisitSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    visitDate: {
        type: Date,
        required: true
    },
    visitTime: {
        type: String, // inny sposób??
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ //Time Format HH:MM 24-hour with leading 0
    },
    duration: { // 30-120 minut lub enum: [30, 60, 90, 120],
        type: Number,
        min: 30,
        max: 120,
        required: true
    },
    animalID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // jak odwołać się do ADMIN - isAdmin: false
        required: true
    },
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // jak odwołać się do ADMIN - isAdmin: true
        required: true
    }
});

//ADOPTION VISIT MODEL

const adoptionVisit = mongoose.model('adoptionVisit', adoptionVisitSchema);

//JOI VALIDATION

function validateVisit(visit) {
    const schema = Joi.object({
        visitDate: Joi.Date().required(),
        visitTime: Joi.String().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), //match czy regex??
        duration: Joi.Number().min(30).max(120).required(),
    });
    return Joi.validate(visit, schema);
}


module.exports = adoptionVisit;