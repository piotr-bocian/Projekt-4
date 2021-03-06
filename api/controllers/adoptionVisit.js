const mongoose = require('mongoose');
const { adoptionVisit, validateVisit } = require('../models/adoptionVisit');

exports.getAllVisits = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    allVisitsInDatabase: await adoptionVisit.count(),
  };
  if (endIndex < (await adoptionVisit.count())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = await adoptionVisit.find()
    .limit(limit)
    .skip(startIndex)
    .sort({ amount: -1 });
  res.send(results);
};

exports.getVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const visit = await adoptionVisit.findById(req.params.id);

    if (!visit) {
      return res.status(404).send('Wizyta adopcyjna, której szukasz nie istnieje');
    }

    res.send(visit);
  } else {
    res.status(400).send('Podano błędny numer _id');
  }
};

exports.makeVisit = async (req, res) => {
  try {
    const { visitDate, visitTime, duration, isVisitDone } = req.body;
    const value = await validateVisit.validateAsync({
      visitDate,
      visitTime,
      duration,
      isVisitDone,
    });
    let visit = new adoptionVisit({
      _id: mongoose.Types.ObjectId(),
      ...value,
      userID: req.body.userID,
      animalID: req.body.animalID,
    });
    visit = await visit.save();
    res.status(201).send({
      message: 'Rezerwacja wizyty adopcyjnej przebiegła pomyślnie',
      visit,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const visit = await adoptionVisit.findByIdAndRemove(req.params.id);

    if (!visit) {
      return res.status(404).send('Wizyta adopcyjna, której szukasz nie istnieje');
    }

    res.status(202).send({
      message: 'Wizyta adopcyjna została poprawnie anulowana',
      visit,
    });
  } else {
    res.status(400).send('Podano błędny numer _id');
  }
};

exports.updateVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) {
    res.status(400).send('Podano błędny numer _id');
    return;
  }
  try {
    const { visitDate, visitTime, duration, isVisitDone } = req.body;
    await validateVisit.validateAsync({
      visitDate,
      visitTime,
      duration,
      isVisitDone,
    });

    let visit = await adoptionVisit.findByIdAndUpdate(
      req.params.id,
      {
        visitDate,
        visitTime,
        duration,
        isVisitDone,
      },
      { new: true }
    );
    res.status(200).send({
      message: 'Zaktualizowano wizytę adopcyjną',
      visit,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};