const mongoose = require('mongoose');
const {
  VolunteerForm,
  validateVolunteerForm,
  validateVolunteerFormLight,
} = require('../models/volunteerForm');

exports.VolunteerFormGetAll = async (req, res, next) => {
  const results = {
    allVolunteerFormInDatabase: await VolunteerForm.count(),
  };
  results.results = await VolunteerForm.find(req.query || req.params);
  res.send({
    request: {
      type: 'GET',
      description: 'Get all animals available for adoption',
    },
    volunteerForms: results,
  });
};

exports.VolunteerFormGetOne = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('Podano błędny numer _id');
  const volunteerForm = await VolunteerForm.findById(req.params.id);
  if (!volunteerForm)
    return res
      .status(404)
      .send('Formularz wolontariusza o podanym ID nie istnieje.');

  res.send({
    volunteerForm: volunteerForm,
    request: {
      type: 'GET',
      description: 'Get all volunteer forms',
      url: 'localhost:3000/api/volunteerForms/',
    },
  });
};

exports.addVolunteerForm = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      mobile,
      occupation,
      preferredTasks,
    } = req.body;
    const value = await validateVolunteerForm.validateAsync({
      firstName,
      lastName,
      birthDate,
      mobile,
      occupation,
      preferredTasks,
    });
    let volunteerForm = new VolunteerForm({
      _id: mongoose.Types.ObjectId(),
      ...value,
    });
    volunteerForm = await volunteerForm.save();
    res.status(201).send({
      message: 'Formularz zostal zapisany',
      volunteerForm,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateVolunteerFormProperty = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Podano bledny numer _id');

  try {
    const updateOps = {};
    for (const [propName, newValue] of Object.entries(req.body)) {
      updateOps[propName] = newValue;
    }

    await validateVolunteerFormLight.validateAsync(updateOps);

    const volunteerForm = await VolunteerForm.findOneAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true }
    );

    res.status(200).send({
      message: `Zaktualizowano nastepujące pola ${JSON.stringify(updateOps)}`,
      volunteerForm,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.deleteVolunteerForm = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('Podano błędny numer _id');

  const volunteerForm = await VolunteerForm.findByIdAndRemove(id);

  if (!volunteerForm)
    return res
      .status(404)
      .send('Taki formularz nie figuruje w naszej bazie danych');

  res.status(202).send({
    message: 'Formularz zostal poprawnie usuniety z bazy danych',
    volunteerForm,
  });
};
