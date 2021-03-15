const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const upl = multer();
const { upload } = require('./api/middleware/upload');
require('dotenv').config();
const app = express();

const userCompany = require('./api/routes/userCompany');
const users = require('./api/routes/users');
const login = require('./api/routes/login');
const visitRoutes = require('./api/routes/adoptionVisit');
const payment = require('./api/routes/payments');
const volunteerForms = require('./api/routes/volunteerForms');
const animalRouter = require('./api/routes/animals');
const postForm = require('./api/routes/postRoutes');
const adoptionForms = require('./api/routes/adoptionFormRoutes');

mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(
    'mongodb+srv://Lukasz:' +
      process.env.ANIMAL_SHELTER_PW +
      '@schronisko.lrx7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
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

app.use(cors());
app.use(express.json());
app.use(upload.single('image') || upl.array());
app.use('/api/users', users);
app.use('/api/usersCompany', userCompany);
app.use('/api/login', login);
app.use('/api/visits', visitRoutes)
app.use('/api/payments', payment);
app.use('/api/volunteerForms', volunteerForms);
app.use('/api/animals', animalRouter);
app.use('/api/posts/', postForm)
app.use('/api/adoptionforms', adoptionForms);
app.use(express.static('uploads'));

//handles query on non-existent route
app.use((req, res, next) => {
  const error = new Error('STRONA O PODANYM ADRESIE NIE ISTNIEJE');
  res.status(404).send(error.message);
  next(error);
});

module.exports = app;
