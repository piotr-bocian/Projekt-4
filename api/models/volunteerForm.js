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
        type: Date,
        required: true
    },
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

function validateVolunteerForm(volunteerForm){
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        birthDate: Joi.date().required(),
        mobile: Joi.string().trim().regex(/^(\+\d{2} )?\d{3}-\d{3}-\d{3}$/).required(),
        occupation: Joi.string.required(),
        preferredTasks: Joi
            .string()
            .valid(
                'praca z psami',
                'praca z kotami',
                'promocja schroniska'
            )
            .required()
    });

    return Joi.validate(volunteerForm, schema);
}

exports.VolunteerForm = VolunteerForm;
exports.validateVolunteerForm = validateVolunteerForm;