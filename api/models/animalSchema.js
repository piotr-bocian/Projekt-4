const mongoose = require('mongoose');
const Joi = require('joi');


//ANIMAL SCHEMA

const animalSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    type: {
        type: String,
        enum: ['dog', 'cat', 'other'],
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
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        lowercase: true,
        required: true
    },
    size: {
        type: String,
        enum: ['small','small/medium', 'medium','medium/big', 'big'],
        lowercase: true,
        required: function() { return this.type === 'dog'}
    },
    description: {
        type: String,
        minlength: 50,
        maxlength: 524288,
        required: true
    },
    image: {

    },
    age: {
        type: Number,
        max: 30
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
        type: Joi.string()
        .valid(
            'dog',
            'cat',
            'other'
        ),
        name: Joi.string().min(2).max(50).required(),
        registrationDate: Joi.Date(),
        gender: Joi.string().lowercase().required()
        .valid(
            'male',
            'female'
        ),
        size: Joi.String().lowercase()
        .when(Joi.type, {
            is: 'dog', then: Joi.required()
        })
        .valid(
            'small',
            'small/medium',
            'medium',
            'medium/big',
            'big'
        ),
        description: Joi.String().min(50).max(524288).required(),
        age: Joi.Number().max(30),
        breed: Joi.String().min(2).max(255)
    });

    return Joi.validate(animal, schema);
}


module.exports = Animal;