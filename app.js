const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(
    'mongodb+srv://Lukasz:' +
      process.env.ANIMAL_SHELTER_PW +
      '@schronisko.lrx7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to Atlas MongoDB');
  })
  .catch((error) => {
    console.log('Connection failed', error);
  });

module.exports = app;
