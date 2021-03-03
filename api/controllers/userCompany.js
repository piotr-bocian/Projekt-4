const auth = require('../middleware/authorization');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { UserCompany, validateUserCompany } = require('../models/userCompany');

exports.userCompanyGetMe = async (req, res, next) => {
    const userCompany = await UserCompany.findById(req.user._id).select('-password');
    res.send(userCompany);
}

exports.userCompanyGetAll = async(req, res, next) => {
    const usersCompany = await UserCompany.find().sort('lastName');
    res.send(usersCompany);
    next();
};

exports.userCompanyGetUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(isIdValid){
        const userCompany = await UserCompany.findById(req.params.id);
        if(!userCompany) return res.status(404).send('Użytkownik o podanym ID nie istnieje.');
        res.send(userCompany);
    }else {
        res.status(400).send('Podano nieprawidłowy numer id');
    }    
};

exports.userCompanyAddUser = async(req, res, next) => {
    try{
        const { email, password, nip, companyName, street, houseNo, city, postcode, mobile, image } = req.body;
        const validCompanyUser = await validateUserCompany.validateAsync(req.body);
        let userCompany = await UserCompany.findOne({ email: req.body.email });
        if(userCompany) return res.status(400).send('Użytkownik o podanym adresie email jest już zarejestrowany.');

        userCompany = new UserCompany({
            _id: new mongoose.Types.ObjectId(),
            ...validCompanyUser
        });
        const salt = await bcrypt.genSalt(10);
        userCompany.password = await bcrypt.hash(userCompany.password, salt);
        userCompany = await userCompany.save();

        const token = userCompany.generateAuthToken();
        res.header('x-auth-token', token).send({
            message: 'Rejestracja przebiegła pomyślnie',
            companyName: userCompany.companyName,
            email: userCompany.email
        });
    } catch (error) {
        res.status(400).send(error.message);
    }

};