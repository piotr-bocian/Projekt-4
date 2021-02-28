const mongoose = require('mongoose');
const {AdoptionForm, validateAdoptionForm} = require('../models/adoptionForm');

// moge tak użyć?
// app.use('/adoptionForms/:adoptionId', (req, res, next) => {
//     const adoptionFormId = Number(req.params.adoptionId);
//     const adoptionFormIndex = adoptionForms.findIndex(form => form.id === adoptionFormId);
//     if (adoptionFormIndex === -1) {
//       return res.status(404).send('Adoption Form not found');
//     }
//     req.adoptionFormIndex = adoptionFormIndex;
//     next();
//   });


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
            url: 'localhost:3000/api/adoptionForms/',
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
    const adoptionId = req.params.adoptionId;
    if(!mongoose.Types.ObjectId.isValid(adoptionId))
        return res.status(400).send('Podano bledny numer _adoptionId');
    try{
        const updateOps = {}
        for(const ops of req.body){
            updateOps[ops.propertyName] = ops.newValue;
        }
        // await validateVolunteerFormLight.validateAsync(updateOps);
        const adoptionForm = await AdoptionForm.findOneAndUpdate(
            { _id: id },
            { $set: updateOps},
        );
        res.status(200).send({
            message: `Zaktualizowano nastepujące pola ${JSON.stringify(
                updateOps
              )}`,
              adoptionForm
        });
    }
    catch(error){
        res.status(400).send(error.message);
    }
  };

// DELETE adoption form
exports.deleteAdoptionForm = (req, res, next) => {
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