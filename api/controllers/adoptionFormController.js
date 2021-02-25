const mongoose = require('mongoose');
const {adoptionForm, validateAdoptionForm} = require('../models/adoptionForm');

exports.AdoptionFormGetAll = async (req, res, next) => {
    const adoptionForms = await adoptionForm.find();
    res.send(adoptionForms);
}

exports.AdoptionFormGetOne = async (req, res, next) => {
    const adoptionFormsOne = await adoptionForm.findById(req.params.id);
    if(!adoptionFormsOne) return res.status(404).send('Formularz wolontariusza o podanym ID nie istnieje.');

    res.send(adoptionFormsOne);
}

exports.addAdoptionForm = async (req, res, next) => {
    try{
        const {content, userID, animalID} = req.body;
        const value = await validateAdoptionForm.validateAsync({
            content,
            userID,
            animalID,
        });
        let adoptionFormOne = new adoptionForm({
            _id: mongoose.Types.ObjectId(),
            ...value
        });
        adoptionFormOne = await adoptionFormOne.save();
        res.status(201).send({
            message: 'Formularz zostal zapisany',
            adoptionFormOne,
          });
    }
    catch(error){
        res.status(400).send(error.message);
    }
}