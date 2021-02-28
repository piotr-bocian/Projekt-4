const express = require('express');
const router = express.Router();
const animalControllers = require('../controllers/animals')

//GET METHOD
router.get('/', animalControllers.getAnimals);
router.get('/:id', animalControllers.getOneAnimal);
router.post('/', animalControllers.addAnimal);

module.exports = router;