const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const adoptionForms = require('./api/routes/adoptionFormRoutes');



mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(
    'mongodb+srv://Lukasz:' +
      process.env.ANIMAL_SHELTER_PW +
      '@schronisko.lrx7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    })
  .then(() => {
    console.log('Connected to Atlas MongoDB');
  })
  .catch((error) => {
    console.log('Connection failed', error);
  });

  app.use(express.json());
  app.use('/api/adoptionForms', adoptionForms);

module.exports = app;
