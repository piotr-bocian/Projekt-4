const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const users = require('./api/routes/users');
const login = require('./api/routes/login');

mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(
    'mongodb+srv://Lukasz:' +
      process.env.ANIMAL_SHELTER_PW +
      '@schronisko.lrx7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
  .then(() => {
    console.log('Connected to Atlas MongoDB');
  })
  .catch((error) => {
    console.log('Connection failed', error);
  });

  if (!process.env.SCHRONISKO_JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: Brak klucza prywatnego JWT.');
    process.exit(1);
  }

  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/login', login);

module.exports = app;
