const fs = require('fs');
const auth = require('../middleware/authorization');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User, validateUser, validatePatchUpdate } = require('../models/user');

exports.usersGetMe = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user)
    return res
      .status(404)
      .send({ message: 'Użytkownik o podanym id nie istnieje.' });

  res.send(user);
};

exports.usersGetAll = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
    allUsersInDatabase: await User.count(),
  };

  if (endIndex < (await User.count())) {
    results.next = {
      page: `/api/users?page=${page + 1}&limit=${limit}`,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: `/api/users?page=${page - 1}&limit=${limit}`,
      limit: limit,
    };
  }

  //search engine
  let search;
  const term = req.query.search;
  if (term) {
    search = {
      $text: { $search: term },
    };
  }

  results.results = await User.find(search || req.query || req.params)
    .select('-password')
    .limit(limit)
    .skip(startIndex)
    .sort({ amount: -1, lastName: 1 });

  res.send({
    request: {
      type: 'GET',
      description: 'Get all users',
      url: 'http://localhost:3000/api/users/',
    },
    users: results,
  });
};

exports.usersGetUser = async (req, res, next) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const user = await User.findById(req.params.id).select('-password');
    if (!user)
      return res
        .status(404)
        .send({ message: 'Podany użytkownik nie istnieje.' });
    res.status(200).send(user);
  } else {
    res.status(400).send({ message: 'Podano nieprawidłowy numer id' });
  }
};

exports.usersAddUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      isSuperAdmin,
      isAdmin,
      isVolunteer,
    } = req.body;
    const validUser = await validateUser.validateAsync(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({
          message:
            'Użytkownik o podanym adresie email jest już zarejestrowany.',
        });

    if (isAdmin || isSuperAdmin) {
      return res
        .status(403)
        .send({
          message: 'Nie masz uprawnień do nadania statusu Administratora.',
        });
    }
    if (!req.file) {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        ...validUser,
      });
    } else {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        ...validUser,
        image: fs.readFileSync(req.file.path),
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res.status(201).send({
      message: 'Rejestracja przebiegła pomyślnie.',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: token,
    });
    next();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.usersAddEmployee = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      isSuperAdmin,
      isAdmin,
      isVolunteer,
    } = req.body;
    const validUser = await validateUser.validateAsync(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({
          message:
            'Użytkownik o podanym adresie email jest już zarejestrowany.',
        });

    if (isSuperAdmin) {
      return res
        .status(403)
        .send({
          message: 'Nie masz uprawnień do nadania statusu Administratora.',
        });
    }
    if (!req.file) {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        ...validUser,
      });
    } else {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        ...validUser,
        image: fs.readFileSync(req.file.path),
      });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res.status(201).send({
      message: 'Pomyślnie dodano pracownika.',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: token,
    });
    next();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.usersUpdateUser = async (req, res, next) => {
  id = req.params.id;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    return res.status(400).send({ message: 'Podano błędny numer id.' });
  }
  let user = await User.findById(id);
  if (!user)
    return res.status(404).send({ message: 'Podany użytkownik nie istnieje.' });

  try {
    const updateUser = {};

    for (const [propName, newValue] of Object.entries(req.body)) {
      if (
        (propName === 'isAdmin' || propName === 'isSuperAdmin') &&
        !req.user.isSuperAdmin
      ) {
        // console.log(req.user, !req.user.isSuperAdmin);
        return res
          .status(403)
          .send({
            message: 'Nie masz uprawnień do zmiany statusu Administratora.',
          });
      }

      updateUser[propName] = newValue;
    }

    if (req.file) {
      updateUser.image = fs.readFileSync(req.file.path);
    }

    await validatePatchUpdate.validateAsync(updateUser);
    for (const propName of Object.entries(req.body)) {
      if (propName === 'password') {
        const salt = await bcrypt.genSalt(10);
        updateUser.password = await bcrypt.hash(updateUser.password, salt);
      }
    }
    user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateUser },
      { new: true }
    );
    res.status(200).send({
      message: `Zaktualizowano następujące pola: ${JSON.stringify(updateUser)}`,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.usersUpdateMe = async (req, res, next) => {
  id = req.user._id;
  let user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send({ message: 'Podany użytkownik nie istnieje.' });

  try {
    let updateUser = {};
    for (const [propName, newValue] of Object.entries(req.body)) {
      console.log(propName);
      if (
        (propName === 'isAdmin' || propName === 'isSuperAdmin') &&
        !req.user.isSuperAdmin
      ) {
        return res
          .status(403)
          .send({
            message:
              'Nie masz uprawnień do nadania sobie statusu Administratora.',
          });
      }
      updateUser[propName] = newValue;
    }
    if (req.file) {
      updateUser.image = fs.readFileSync(req.file.path);
    }
    await validatePatchUpdate.validateAsync(updateUser);
    for (const [propName] of Object.entries(req.body)) {
      if (propName === 'password') {
        const salt = await bcrypt.genSalt(10);
        updateUser.password = await bcrypt.hash(updateUser.password, salt);
      }
    }

    user = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateUser },
      { new: true }
    );
    res.status(200).send({
      message: `Zaktualizowano następujące pola: ${JSON.stringify(updateUser)}`,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.usersDeleteMe = async (req, res, next) => {
  let user = await User.findById(req.user._id).select('-password');
  if (!user)
    return res.status(404).send({ message: 'Podany użytkownik nie istnieje.' });

  if (user.isSuperAdmin) {
    return res
      .status(403)
      .send({
        message:
          'Tylko inny superAdmin może usunąć konto o uprawnieniach superAdmin.',
      });
  }

  user = await User.findByIdAndRemove(req.user._id).select('-password');

  res.status(202).send({
    message: 'Konto zostało poprawnie usunięte',
    user,
  });
};

exports.usersDeleteUser = async (req, res, next) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) {
    return res.status(400).send({ message: 'Podano błędny numer id.' });
  }

  let user = await User.findById(req.params.id);
  if ((user.isAdmin || user.isSuperAdmin) && !req.user.isSuperAdmin) {
    return res
      .status(403)
      .send({
        message: 'Nie masz uprawnień do usunięcia konta administratora.',
      });
  }

  if (user.isSuperAdmin && user.id === req.user._id) {
    return res
      .status(403)
      .send({
        message:
          'Tylko inny superAdmin może usunąć konto o uprawnieniach superAdmin.',
      });
  }

  user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    return res.status(404).send({ message: 'Podany użytkownik nie istnieje.' });
  }

  res.status(202).send({
    message: 'Pomyślnie usunięto konto użytkownika.',
    user,
  });
};
