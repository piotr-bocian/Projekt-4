const mongoose = require('mongoose');
const {adoptionForm, validateAdoptionForm} = require('../models/adoptionForm');

// moge tak użyć?
app.use('/adoptionForms/:adoptionId', (req, res, next) => {
    const adoptionFormId = Number(req.params.adoptionId);
    const adoptionFormIndex = adoptionForms.findIndex(form => form.id === adoptionFormId);
    if (cardIndex === -1) {
      return res.status(404).send('Card not found');
    }
    req.adoptionFormIndex = adoptionFormIndex;
    next();
  });

// GETL ALL adoption forms
exports.AdoptionFormGetAll = async (req, res, next) => {
    const adoptionForms = await adoptionForm.find();
    res.send(adoptionForms);
}

// GET one adoption form
exports.AdoptionFormGetOne = async (req, res, next) => {
    const adoptionFormsOne = await adoptionForm.findById(req.params.adoptionId);
    if(!adoptionFormsOne) return res.status(404).send('Formularz wolontariusza o podanym ID nie istnieje.');

    res.send(adoptionFormsOne);
}

// POST adoption form
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

// UPDATE adoption form
exports.editAdoptionForm = async (req, res, next) => {
    const newAdoptionForm = await req.body;
    const adoptionFormId = Number(req.params.adoptionFormId);
    if (!newAdoptionForm.id || newAdoptionForm.id !== adoptionFormId) {
        newAdoptionForm.id = adoptionFormId;
    }
    adoptionForms[req.adoptionFormIndex] = newAdoptionForm;
    res.send(newAdoptionForm);
  };

// DELETE adoption form
exports.deleteAdoptionForm = (req, res, next) => {
    cards.splice(req.adoptionFormIndex, 1);
    res.status(204).send();
  };