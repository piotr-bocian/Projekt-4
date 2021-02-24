const mongoose = require('mongoose');
const { User, validateUser } = require('../models/user');


// exports.getUsers = async(req, res, next) => {
//     const users = await User.find().sort('lastName');
//     console.log(users);
//     res.send(users);
//     next();
// };