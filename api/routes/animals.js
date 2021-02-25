const express = require('express');
const router = express.Router();
const animalControllers = require('../controllers/animals')

//GET METHOD
router.get('/', animalControllers.getAnimals);


module.exports = router;