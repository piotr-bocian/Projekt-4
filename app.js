const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const animalRouter = require('./api/routes/animals');
const app = express();


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


app.use(express.json());
app.use('/api/animals', animalRouter);

module.exports = app;
