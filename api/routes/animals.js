const express = require('express');
const router = express.Router();
const animalControllers = require('../controllers/animals')

//GET METHOD
router.get('/', animalControllers.getAnimals);
router.get('/:id', animalControllers.getOneAnimal);
router.post('/', animalControllers.addAnimal);
router.put('/:id', animalControllers.updateAnimal);
router.delete('/:id', animalControllers.deleteAnimal);

module.exports = router;