const jwt = require('jsonwebtoken');

exports.loggedUser = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({message: 'Odmowa dostępu. Operacja możliwa tylko dla zalogowanego użytkownika.'});

    try {
        const decoded = jwt.verify(token, process.env.SCHRONISKO_JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send({message: 'Nieprawidłowy token.'})
    }
}

exports.isAdmin = function (req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send({message: 'Brak uprawnień do wykonania tej operacji.'});
    next();
}

exports.isSuperAdmin = function (req, res, next) {
    if(!req.user.isSuperAdmin) return res.status(403).send({message: 'Brak uprawnień do wykonania tej operacji.'});
    next();
}

exports.isVolunteer = function (req, res, next) {
    if(!req.user.isVolunteer) return res.status(403).send({message: 'Brak uprawnień do wykonania tej operacji.'});
    next();
}