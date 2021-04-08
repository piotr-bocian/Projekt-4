const auth = require('../middleware/authorization');
const fs = require('fs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { UserCompany, validateUserCompany, validatePatchUpdate } = require('../models/userCompany');
const { User } = require('../models/user');

exports.userCompanyGetMe = async (req, res, next) => {
    const userCompany = await UserCompany.findById(req.user._id).select('-password');
    if (!userCompany) {
      return res.status(404).send({message: 'Użytkownik o podanym ID nie istnieje.'});
    };
    res.send(userCompany);
}

exports.usersGetAll = async(req, res, next) => {
    const usersCompany = await UserCompany.find().sort('companyName');
    const users = await User.find().sort('lastName');
    res.send([...users, ...usersCompany]);
};

exports.userCompanyGetUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(isIdValid){
        const userCompany = await UserCompany.findById(req.params.id);
        if(!userCompany) return res.status(404).send({message: 'Użytkownik o podanym ID nie istnieje.'});
        res.send(userCompany);
    }else {
        res.status(400).send({message: 'Podano nieprawidłowy numer id'});
    }    
};

exports.userCompanyAddUser = async(req, res, next) => {
    try{
        const { email, password, nip, companyName, street, houseNo, city, postcode, mobile } = req.body;
        const validCompanyUser = await validateUserCompany.validateAsync(req.body);
        let userCompany = await UserCompany.findOne({ email: req.body.email });
        if(userCompany) return res.status(400).send({message: 'Użytkownik o podanym adresie email jest już zarejestrowany.'});
        
        // IMAGE CHECK
        if (!req.file) {
          userCompany = new UserCompany({
            _id: new mongoose.Types.ObjectId(),
            ...validCompanyUser
          });
        } else {
          userCompany = new UserCompany({
            _id: new mongoose.Types.ObjectId(),
            ...validCompanyUser,
            image: fs.readFileSync(req.file.path)
          });
        }
        
        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        userCompany.password = await bcrypt.hash(userCompany.password, salt);
        userCompany = await userCompany.save();

        // GENERATE TOKEN
        const token = userCompany.generateAuthToken();
        res.header('x-auth-token', token).send({
            message: 'Rejestracja przebiegła pomyślnie',
            companyName: userCompany.companyName,
            email: userCompany.email
        });
    } catch (error) {
        res.status(400).send({message: error.message});
    }

};

exports.userCompanyDeleteMe = async (req, res, next) => {
    const userCompany = await UserCompany.findByIdAndRemove(req.user._id).select('-password');
    if (!userCompany) {
      return res.status(404).send({message: 'Użytkownik o podanym ID nie istnieje.'});
    };
    res.status(202).send({
        message: 'Użytkownik został poprawnie usunięty',
        userCompany,
    });
}

exports.userCompanyDeleteUser = async (req, res) => {
const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
if (isIdValid) {
    const userCompany = await UserCompany.findByIdAndRemove(req.params.id);

    if (!userCompany) {
    return res.status(404).send({message: 'Użytkownik o podanym ID nie istnieje.'});
    }

    res.status(202).send({
    message: 'Użytkownik został poprawnie usunięty',
    userCompany,
    });
} else {
    res.status(400).send({message: 'Podano błędny numer _id'});
    }
};

exports.userCompanyUpdateUser = async (req, res) => {
  const id = req.params.id;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    res.status(400).send({message: 'Podano błędny numer _id'});
    return;
  }
  try {
    let updateUserCompany = {};
    for (const [propName, newValue] of Object.entries(req.body)) {
      updateUserCompany[propName] = newValue;
    }
    if (req.file) {
      updateUserCompany.image = fs.readFileSync(req.file.path);
    }
    await validatePatchUpdate.validateAsync(updateUserCompany);
    for (const [propName] of Object.entries(req.body)) {
      if (propName === 'password') {
        const salt = await bcrypt.genSalt(10);
        updateUserCompany.password = await bcrypt.hash(updateUserCompany.password, salt);
      };
    }
    
    const userCompany = await UserCompany.findOneAndUpdate(
      { _id: id },
      { $set: updateUserCompany },
      { new: true }
    );
    res.status(200).send({
      message: `Zaktualizowano nastepujące pola ${JSON.stringify(
        updateUserCompany
      )}`
    });
  } catch (error) {
    res.status(400).send({message: error.message});
  }
};


exports.userCompanyUpdateMe = async (req, res) => {
  id = req.user._id;
  let userCompany = await UserCompany.findById(id)
  if(!userCompany) return res.status(404).send({message: 'Podany użytkownik nie istnieje.'});
  try {
    let updateUserCompany = {};
    for (const [propName, newValue] of Object.entries(req.body)) {
      updateUserCompany[propName] = newValue;
    };
    if (req.file) {
      updateUserCompany.image = fs.readFileSync(req.file.path);
    }
    await validatePatchUpdate.validateAsync(updateUserCompany);
    for (const [propName] of Object.entries(req.body)) {
      if (propName === 'password') {
        const salt = await bcrypt.genSalt(10);
        updateUserCompany.password = await bcrypt.hash(updateUserCompany.password, salt);
      };
    };
    userCompany = await UserCompany.findOneAndUpdate(
      { _id: id },
      { $set: updateUserCompany },
      { new: true }
    );
    res.status(200).send({
      message: `Zaktualizowano nastepujące pola ${JSON.stringify(updateUserCompany)}`
    });
  } catch (error) {
    res.status(400).send({message: error.message});
  }
};

