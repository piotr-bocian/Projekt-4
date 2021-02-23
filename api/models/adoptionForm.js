const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


const adoptionFormSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    animalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Animal',
    }
})

const adoptionForm = mongoose.model('Adoption', adoptionFormSchema);

//JOI VALIDATION

function validateAdoptionForm(form) {
    const schema = Joi.object({
        content: Joi.String.required(),
    });
    return Joi.validate(form, schema);
}


exports.adoptionForm = adoptionForm;
exports.validateAdoptionForm = validateAdoptionForm;


