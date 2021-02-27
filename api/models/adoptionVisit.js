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
    isVisitDone: {
        type: Boolean,
        required: true,
        default: false
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    animalID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
    },
});

//ADOPTION VISIT MODEL

const adoptionVisit = mongoose.model('adoptionVisit', adoptionVisitSchema);

//JOI VALIDATION


const schema = Joi.object({
    visitDate: Joi.date().required(),
    visitTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    duration: Joi.number().min(30).max(120).required(),
    isVisitDone: Joi.boolean().required()
});



exports.adoptionVisit = adoptionVisit;
exports.validateVisit = schema;