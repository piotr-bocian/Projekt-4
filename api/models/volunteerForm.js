const mongoose = require('mongoose');
const Joi = require('joi');

const volunteerFormSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true,
        match: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
    },
    //birthDate: Joi.string().trim().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required()
    mobile: {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 15,
        match: /^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/
        // mobile no pattern: +48 123-456-789, or 123-456-789
    },
    occupation: {
        type: String,
        required: true
    },
    preferredTasks: {
        type: String,
        required: true,
        enum: [
            'praca z psami', 
            'praca z kotami', 
            'promocja schroniska'
        ]
    }
});

const VolunteerForm = mongoose.model('VolunteerForm', volunteerFormSchema);

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.string().trim().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
    mobile: Joi.string().trim().regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/).required(),
    occupation: Joi.string().required(),
    preferredTasks: Joi
        .string()
        .valid(
            'praca z psami',
            'praca z kotami',
            'promocja schroniska'
        )
        .required()
});

const schemaLight = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    birthDate: Joi.string().trim().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
    mobile: Joi.string().trim().regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/),
    occupation: Joi.string(),
    preferredTasks: Joi
        .string()
        .valid(
            'praca z psami',
            'praca z kotami',
            'promocja schroniska'
        )
});

exports.VolunteerForm = VolunteerForm;
exports.validateVolunteerForm = schema;
exports.validateVolunteerFormLight = schemaLight;