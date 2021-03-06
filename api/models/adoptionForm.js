const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');



const adoptionFormSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
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

const AdoptionForm = mongoose.model('AdoptionForm', adoptionFormSchema);

//JOI VALIDATION


    const schema = Joi.object({
        content: Joi.string().required(),
        userID: Joi.string().required(),
        animalID: Joi.string()
    });

exports.AdoptionForm = AdoptionForm;
exports.validateAdoptionForm = schema;