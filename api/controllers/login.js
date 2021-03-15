const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User } = require('../models/user');

exports.logging = async(req, res, next) => {
    try{
        const { email, password } = req.body;
        const validLogin = await loginSchema.validateAsync(req.body);
        let user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(400).send('Nieprawidłowy email lub hasło.');

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) return res.status(400).send('Nieprawidłowy email lub hasło.');

        const token = user.generateAuthToken();
        res.status(200).send({
            message: 'Logowanie przebiegło pomyślnie.',
            token
        });
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const loginSchema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z<>!@#$%^&*?_=+-]{8,}$/).required()
});