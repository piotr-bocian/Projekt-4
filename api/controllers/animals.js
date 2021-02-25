const { Animal } = require('../models/animalSchema');


//GET METHOD
exports.getAnimals = async (req, res) => {
    const animals = await Animal.find();
    res.status(200).send(animals);
}