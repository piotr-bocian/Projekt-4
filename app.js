const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const visitRoutes = require('./api/routes/adoptionVisit');
const payment = require('./api/routes/payments');
const volunteerForms = require('./api/routes/volunteerForms');

mongoose.set('useUnifiedTopology', true);
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
app.use('/api/visits', visitRoutes)
app.use('/api/payments', payment);
app.use('/api/volunteerForms', volunteerForms);

//handles query on non-existent route
app.use((req, res, next) => {
  const error = new Error('STRONA O PODANYM ADRESIE NIE ISTNIEJE');
  res.status(404).send(error.message);
  next(error);
});

module.exports = app;
