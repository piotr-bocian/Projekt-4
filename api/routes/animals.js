const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload')
const { Animal, validateAnimal } = require('../models/animalSchema');
const animalControllers = require('../controllers/animals');
const auth = require('../middleware/authorization');


//GET METHOD
router.get('/', animalControllers.getAnimals);
router.get('/adminanimals',[auth.loggedUser ,auth.isAdmin], animalControllers.getAdminAnimals);
router.get('/:id', [auth.loggedUser ,auth.isAdmin], animalControllers.getOneAnimal);
router.post('/', [auth.loggedUser ,auth.isAdmin], upload.single('image'), animalControllers.addAnimal);
router.put('/:id', [auth.loggedUser ,auth.isAdmin], animalControllers.updateAnimal);
router.delete('/:id', [auth.loggedUser ,auth.isAdmin], animalControllers.deleteAnimal);

module.exports = router;
