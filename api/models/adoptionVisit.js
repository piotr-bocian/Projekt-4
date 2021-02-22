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
        type: String,
        required: true,
        match: /^([0-1]?[0-9]):[0-5][0-9]$/ //Time Format HH:MM 24-hour with leading 0
    },
    duration: {
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
        ref: 'User',
        required: true
    },
    isVisitDone: {
        type: Boolean,
        required: true
    }
});

//ADOPTION VISIT MODEL

const adoptionVisit = mongoose.model('adoptionVisit', adoptionVisitSchema);

//JOI VALIDATION

function validateVisit(visit) {
    const schema = Joi.object({
        visitDate: Joi.Date().required(),
        visitTime: Joi.String().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        duration: Joi.Number().min(30).max(120).required(),
        isVisitDone: Joi.Boolean().required()
    });
    return Joi.validate(visit, schema);
}


exports.adoptionVisit = adoptionVisit;
exports.validateVisit = validateVisit;