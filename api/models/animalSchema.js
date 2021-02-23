const mongoose = require('mongoose');
const Joi = require('joi');


//ANIMAL SCHEMA

const animalSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    animalType: {
        type: String,
        enum: ['pies', 'kot', 'inne'],
        lowercase: true,
        required: true
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now,
        required: true,
        validate: function(input) {
            return new Date(input) <= new Date();
        }
    },
    gender: {
        type: String,
        enum: ['męska', 'żeńska'],
        lowercase: true,
        required: true
    },
    size: {
        type: String,
        enum: ['mały','mały/średni', 'średni','średni/duży', 'duży'],
        lowercase: true,
        required: function() { return this.animalType === 'pies'}
    },
    description: {
        type: String,
        minlength: 50,
        maxlength: 524288,
        required: true
    },
    image: {
        type: String
    //will be added later (needed configuration 'multer')
    },
    age: {
        type: Number
    },
    breed: {
        type: String,
        minlength: 2,
        maxlength: 255
    }
});

//ANIMAL MODEL

const Animal = mongoose.model('Animal', animalSchema);

//JOI VALIDATION

function validateAnimal(animal) {
    const schema = Joi.object({
        animalType: Joi.string()
        .valid(
            'pies',
            'kot',
            'inne'
        ),
        name: Joi.string().min(2).max(50).required(),
        registrationDate: Joi.date(),
        gender: Joi.string().lowercase().required()
        .valid(
            'męska',
            'żeńska'
        ),
        size: Joi.String().lowercase()
        // .when(Joi.animalType, {
        //     is: 'pies', then: Joi.required()
        // })
        .valid(
            'mały',
            'mały/średni',
            'średni',
            'średni/duży',
            'duży'
        ),
        description: Joi.String().min(50).max(524288).required(),
        age: Joi.Number().max(30),
        breed: Joi.String().min(2).max(255)
    });

    return Joi.validate(animal, schema);
}

exports.Animal = Animal;
exports.validateAnimal = validateAnimal;
