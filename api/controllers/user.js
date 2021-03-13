const auth = require('../middleware/authorization');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User, validateUser, validatePatchUpdate } = require('../models/user');

exports.usersGetMe = async (req, res, next) => {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(404).send('Użytkownik o podanym id nie istnieje.');

    res.send(user);
}

exports.usersGetAll = async(req, res, next) => {
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
    
    results.results = await User.find().select('-password')
        .limit(limit)
        .skip(startIndex)
        .sort({ amount: -1,
        lastName: 1 });
    
    res.send({
        request: {
          type: 'GET',
          description: 'Get all users',
          url: 'http://localhost:3000/api/users/',
        },
        users: results
    });
};

exports.usersGetUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(isIdValid){
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');
        res.send(user);
    }else {
        res.status(400).send('Podano nieprawidłowy numer id');
    }    
};

exports.usersAddUser = async(req, res, next) => {
    try{
        const { firstName, lastName, email, password, mobile, isSuperAdmin, isAdmin, isVolunteer } = req.body;
        const validUser = await validateUser.validateAsync(req.body);
        let user = await User.findOne({ email: req.body.email });
        if(user) return res.status(400).send('Użytkownik o podanym adresie email jest już zarejestrowany.');

        if(isAdmin || isSuperAdmin){
            return res.status(403).send('Nie masz uprawnień do nadania statusu Administratora.')
        }
        if (!req.file) {
            user = new User({
              _id: mongoose.Types.ObjectId(),
              ...validUser
            });
          } else {
            user = new User({
              _id: mongoose.Types.ObjectId(),
              ...validUser,
              image: fs.readFileSync(req.file.path)
            });
          };
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send({
            message: 'Rejestracja przebiegła pomyślnie',
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
        next();
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.usersUpdateUser = async(req, res, next) => {
    id = req.params.id;
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if(!isIdValid){
        return res.status(400).send('Podano błędny numer id.');
    }
    let user = await User.findById(id)
    if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');

    try {
        const updateUser = {}

        for (const update of req.body) {
            if ((update.propertyName === 'isAdmin' || update.propertyName === 'isSuperAdmin') && !req.user.isSuperAdmin){
                console.log(req.user, !req.user.isSuperAdmin);
                return res.status(403).send('Nie masz uprawnień do zmiany statusu Administratora.');
            } 
            if (update.propertyName === 'image') {
                updateUser.image = fs.readFileSync(req.file.path);
            }
            updateUser[update.propertyName] = update.newValue;
        };

        await validatePatchUpdate.validateAsync(updateUser);
        for (const update of req.body) {
            if (update.propertyName === 'password') {
                const salt = await bcrypt.genSalt(10);
                updateUser.password = await bcrypt.hash(updateUser.password, salt);
            };
        };
        user = await User.findOneAndUpdate(
            { _id: id },
            { $set: updateUser},
            { new: true }
        );
        res.status(200).send({
            message: `Zaktualizowano następujące pola: ${JSON.stringify(updateUser)}`
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.usersUpdateMe = async(req, res, next) => {
    id = req.user._id;
    let user = await User.findById(req.user._id)
    if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');
    
    try {
        const updateUser = {};
        for (const update of req.body) {
            if ((update.propertyName === 'isAdmin' || update.propertyName === 'isSuperAdmin') && !req.user.isSuperAdmin){
                return res.status(403).send('Nie masz uprawnień do nadania sobie statusu Administratora.');
            }
            if (update.propertyName === 'image') {
                updateUser.image = fs.readFileSync(req.file.path);
            }
            updateUser[update.propertyName] = update.newValue;
        };
        await validatePatchUpdate.validateAsync(updateUser);
        for (const update of req.body) {
            if (update.propertyName === 'password') {
                const salt = await bcrypt.genSalt(10);
                updateUser.password = await bcrypt.hash(updateUser.password, salt);
            };
        };
        
        user = await User.findOneAndUpdate(
            { _id: id },
            { $set: updateUser},
            { new: true }
        );
        res.status(200).send({
            message: `Zaktualizowano następujące pola: ${JSON.stringify(updateUser)}`
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.usersDeleteMe = async(req, res, next) => {
    let user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(404).send('Podany użytkownik nie istnieje.');

    if(user.isSuperAdmin){
        return res.status(403).send('Tylko inny superAdmin może usunąć konto o uprawnieniach superAdmin.');
    }

    user = await User.findByIdAndRemove(req.user._id).select('-password');

    res.status(202).send({
        message: 'Konto zostało poprawnie usunięte',
        user
    });
}

exports.usersDeleteUser = async(req, res, next) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isIdValid){
        return res.status(400).send('Podano błędny numer id.');
    }

    let user = await User.findById(req.params.id)
    if((user.isAdmin || user.isSuperAdmin) && !req.user.isSuperAdmin){
        return res.status(403).send('Nie masz uprawnień do usunięcia konta administratora.');
    }

    if(user.isSuperAdmin && user.id === req.user._id){
        return res.status(403).send('Tylko inny superAdmin może usunąć konto o uprawnieniach superAdmin.');
    }

    user = await User.findByIdAndRemove(req.params.id);
    if(!user){
        return res.status(404).send('Podany użytkownik nie istnieje.');
    }

    res.status(202).send({
        message: 'Pomyślnie usunięto konto użytkownika.',
        user
    });
}
