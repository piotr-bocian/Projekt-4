const mongoose = require('mongoose');
const Joi = require('joi');
const multer = require('multer');
const { boolean } = require('joi');


//ANIMAL SCHEMA

const animalSchema = new mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
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
        type: Buffer.from('base64')
    },
    age: {
        type: Number
    },
    breed: {
        type: String,
        minlength: 2,
        maxlength: 255,
        lowercase: true
    },
    isAdopted: {
        type: Boolean,
        default: false
    }
});

//ANIMAL MODEL

const Animal = mongoose.model('Animal', animalSchema);

//JOI VALIDATION

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
    size: Joi.string().lowercase()
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
    description: Joi.string().min(50).max(524288).required(),
    age: Joi.number().max(30),
    breed: Joi.string().min(2).max(255),
    isAdopted: Joi.boolean()
});


exports.Animal = Animal;
exports.validateAnimal = schema;
