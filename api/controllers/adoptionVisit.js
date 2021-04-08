const mongoose = require('mongoose');
const { adoptionVisit, validateVisit, validatePatchUpdate} = require('../models/adoptionVisit');

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
      return res.status(404).send({message:'Wizyta adopcyjna, której szukasz nie istnieje'});
    }

    res.send({
      visit,
      request: {
        type: 'GET',
        description: 'Get all adoption visits',
        url: 'http://localhost:3000/api/visits/',
      },
    });
  } else {
    res.status(400).send({message:'Podano błędny numer _id'});
  }
};

exports.getMyVisits = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    allVisitsInDatabase: await adoptionVisit.find({userID: req.user._id}).count(),
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

  results.results = await adoptionVisit.find({userID: req.user._id})
    .limit(limit)
    .skip(startIndex)
    .sort({ amount: -1 });
  res.send(results);
};

exports.getMyVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const visit = await adoptionVisit.findById(req.params.id);

    if (!visit) {
      return res.status(404).send({message:'Wizyta adopcyjna, której szukasz nie istnieje'});
    }

    if (visit.userID != req.user._id) {
      return res.status(403).send({message:'Brak uprawnień do wykonania tej operacji.'});
    }

    res.send({
      visit,
      request: {
        type: 'GET',
        description: 'Get all adoption visits',
        url: 'http://localhost:3000/api/visits/me/',
      },
    });
  } else {
    res.status(400).send({message:'Podano błędny numer _id'});
  }
};

exports.makeMyVisit = async (req, res) => {
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
      userID: req.user._id,
      animalID: req.body.animalID,
    });
    visit = await visit.save();
    res.status(201).send({
      message: 'Rezerwacja wizyty adopcyjnej przebiegła pomyślnie',
      visit,
    });
  } catch (error) {
    res.status(400).send({message: error.message});
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
    res.status(400).send({message: error.message});
  }
};

exports.deleteVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const visit = await adoptionVisit.findByIdAndRemove(req.params.id);

    if (!visit) {
      return res.status(404).send({message:'Wizyta adopcyjna, której szukasz nie istnieje'});
    }

    res.status(202).send({
      message: 'Wizyta adopcyjna została poprawnie anulowana',
      visit,
      request: {
        type: 'DELETE',
        description: 'To see all adoption visits go to:',
        url: 'http://localhost:3000/api/visits/',
      },
    });
  } else {
    res.status(400).send({message:'Podano błędny numer _id'});
  }
};

exports.deleteMyVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {

    const visit = await adoptionVisit.findById(req.params.id)

    if (!visit) {
      return res.status(404).send({message:'Wizyta adopcyjna, której szukasz nie istnieje'});
    }

    // userID.check
    if (visit.userID != req.user._id) {
      return res.status(403).send({message:'Brak uprawnień do wykonania tej operacji.'});
    }
    // Visit date check
    if (visit.visitDate <= Date.now()) {
      return res.status(403).send({message:'Czas na anulowanie wizyty adopcyjnej minął.'});
    };

    const visitToDelete = await adoptionVisit.findByIdAndRemove(req.params.id);

    res.status(202).send({
      message: 'Wizyta adopcyjna została poprawnie anulowana',
      visit,
      request: {
        type: 'DELETE',
        description: 'To see all adoption visits go to:',
        url: 'http://localhost:3000/api/visits/me/',
      },
    });
  } else {
    res.status(400).send({message:'Podano błędny numer _id'});
  }
};

exports.updateVisit = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) {
    res.status(400).send({message:'Podano błędny numer _id'});
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
      request: {
        type: 'PUT',
        description: 'To see all adoption visits go to:',
        url: 'http://localhost:3000/api/visits/',
      },
    });
  } catch (error) {
    res.status(400).send({message: error.message});
  }
};

exports.updateMyVisit = async (req, res) => {
  const id = req.params.id;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    res.status(400).send({message:'Podano błędny numer _id'});
    return;
  }
  try {
    let updateVisit = {};
    // forbidden changes by user:
    for (const [propName, newValue] of Object.entries(req.body)) {
      if (propName === 'isVisitDone') {
        return res.status(403).send({message:'Brak uprawnień do wykonania tej operacji.'});
      };
      if (propName === 'userID') {
        return res.status(403).send({message:'Brak uprawnień do wykonania tej operacji.'});
      };
      updateVisit[propName] = newValue;
    }

    await validatePatchUpdate.validateAsync(updateVisit);
    
    // Visit check
    const visitCheck = await adoptionVisit.findOne(
      { _id: id });
    // Visit userId check
    if (visitCheck.userID != req.user._id) {
      // console.log(visitCheck.userID, req.user._id)
      return res.status(403).send({message: 'Brak uprawnień do wykonania tej operacji.'});
    }
    // Visit date check
    if (visitCheck.visitDate <= Date.now()) {
      return res.status(403).send({message: 'Czas na anulowanie wizyty adopcyjnej minął.'});
    };

    const visit = await adoptionVisit.findOneAndUpdate(
      { _id: id },
      { $set: updateVisit },
      { new: true }
    );
    res.status(200).send({
      message: `Zaktualizowano nastepujące pola ${JSON.stringify(
        updateVisit
      )}`,
      request: {
        type: 'PATCH',
        description: 'To see all adoption visits go to:',
        url: 'http://localhost:3000/api/visits/me/',
      },
    });
  } catch (error) {
    res.status(400).send({message: error.message});
  }
};