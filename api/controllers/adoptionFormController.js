const mongoose = require('mongoose');
const { AdoptionForm, validateAdoptionForm } = require('../models/adoptionForm');

// GETL ALL adoption forms
exports.AdoptionFormGetAll = async (req, res, next) => {
    const adoptionForms = await AdoptionForm.find();
    res.send(adoptionForms);
}

// GET one adoption form
exports.AdoptionFormGetOne = async (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.adoptionId))
        return res.status(400).send('Podano błędny numer _adoptionId');
    const adoptionForm = await AdoptionForm.findById(req.params.adoptionId);
    if(!adoptionForm) return res.status(404).send('Formularz wolontariusza o podanym ID nie istnieje.');

    res.send({
        adoptionForm: adoptionForm,
        request: {
            type: 'GET',
            description: 'Get all volunteer forms',
            url: 'localhost:3000/api/adoptionforms/',
        }
    });
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
        let adoptionFormOne = new AdoptionForm({
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
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.adoptionId);
    if (!isIdValid) {
      res.status(400).send('Podano błędny numer _adoptionId');
      return;
    }
    try {
      const { content, userID, animalID } = req.body;
      console.log(req.body)
      await validateAdoptionForm.validateAsync({
        content,
        userID,
        animalID,
      });
  
      let form = await AdoptionForm.findByIdAndUpdate(
        req.params.adoptionId,
        {
            content,
            userID,
            animalID,
        },
        { new: true }
      );
      res.status(200).send({
        message: 'Zaktualizowano formularz',
        form,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

// DELETE adoption form
exports.deleteAdoptionForm = async (req, res, next) => {
    const adoptionId = req.params.adoptionId;
    if(!mongoose.Types.ObjectId.isValid(adoptionId))
        return res.status(400).send('Podano błędny numer _adoptionId');

    const adoptionForm = await AdoptionForm.findByIdAndRemove(adoptionId);

    if(!adoptionForm)
        return res.status(404).send('Taki formularz nie figuruje w naszej bazie danych');

    res.status(202).send({
        message: 'Formularz zostal poprawnie usuniety z bazy danych',
        adoptionForm
    });
}