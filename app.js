const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const userCompany = require('./api/routes/userCompany');
// const login = require('./api/routes/login');
const payment = require('./api/routes/payments');

mongoose
  .connect(
    'mongodb+srv://Lukasz:' +
      process.env.ANIMAL_SHELTER_PW +
      '@schronisko.lrx7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
  .then(() => {
    console.log('Connected to Atlas MongoDB');
  })
  .catch((error) => {
    console.log('Connection failed', error);
  });

app.use(express.json());
app.use('/api/usersCompany', userCompany);
app.use('/api/payments', payment);

//handles query on non-existent route
app.use((req, res, next) => {
  const error = new Error('STRONA O PODANYM ADRESIE NIE ISTNIEJE');
  res.status(404).send(error.message);
  next(error);
});

module.exports = app;
