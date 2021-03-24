const mongoose = require('mongoose');
const fs = require('fs');
const { Animal, validateAnimal } = require('../models/animalSchema');


//GET METHOD - ALL ANIMALS AVAILABLE FOR ADOPTION
exports.getAnimals = async (req, res) => {

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
        allAnimalsInDatabase: await Animal.count()
    };

    if (endIndex < (await Animal.count())) {
        results.next = {
          page: `/api/animals?page=${page + 1}&limit=${limit}`,
          limit: limit
        };
    }
    
    if (startIndex > 0) {
        results.previous = {
          page: `/api/animals?page=${page - 1}&limit=${limit}`,
          limit: limit
        };
    }
   
    // search engine
    let search;
    const term = req.query.search;
      if (term) {
        search = {
          $text: { $search: term },
          isAdopted: false
        };
      }

    results.results = await Animal
        .find(search)
        .limit(limit)
        .skip(startIndex)
        .sort({ amount: -1 });
    
    res.send({
        request: {
          type: 'GET',
          description: 'Get all animals available for adoption',
          url: 'http://localhost:3000/api/animals/',
        },
        animals: results
    });
};

//GET METHOD - ALL ANIMALS FOR ADMIN
exports.getAdminAnimals = async (req, res) => {

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {
      allAnimalsInDatabase: await Animal.count(),
  };

  if (endIndex < (await Animal.count())) {
      results.next = {
        page: `/api/animals/adminanimals?page=${page + 1}&limit=${limit}`,
        limit: limit,
      };
  }
  
  if (startIndex > 0) {
      results.previous = {
        page: `/api/animals/adminanimals?page=${page - 1}&limit=${limit}`,
        limit: limit,
      };
  }
 
  // search engine
  let search;
  const term = req.query.search;
  if (term) {
    search = {
      $text: { $search: term }
    };
  }

  results.results = await Animal.find(search)
      .limit(limit)
      .skip(startIndex)
      .sort({ amount: -1 });
  
  res.send({
      request: {
        type: 'GET',
        description: 'Get all animals',
        url: 'http://localhost:3000/api/animals/adminanimals',
      },
      animals: results
  });
};

//GET METHOD - ONE ANIMAL
exports.getOneAnimal = async (req, res) => {
    
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (isIdValid) {
      const animal = await Animal.findById(req.params.id);
  
    if (!animal) {
        return res.status(404).send('Zwierzaka, którego szukasz, nie ma w naszej bazie danych');
    }
  
    res.send({
        request: {
          type: 'GET',
          description: 'Get an animals',
          url: 'http://localhost:3000/api/animals/',
        },
        animal: animal,
      });
    } else {
      res.status(400).send('Podano błędny numer _id');
    }
};

//GET METHOD - ONE ANIMAL
exports.getOneAnimalAdmin= async (req, res) => {
    
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    const animal = await Animal.findById(req.params.id);

  if (!animal) {
      return res.status(404).send('Zwierzaka, którego szukasz, nie ma w naszej bazie danych');
  }

  res.send({
      request: {
        type: 'GET',
        description: 'Get an animals',
        url: 'http://localhost:3000/api/adminanimals/:id',
      },
      animal: animal,
    });
  } else {
    res.status(400).send('Podano błędny numer _id');
  }
};

//POST METHOD - POST AN ANIMAL
exports.addAnimal = async (req, res) => {
    try {
        const { animalType, name, registrationDate, gender, size, description, age, breed, isAdopted } = req.body;
        let animal;
        const value = await validateAnimal.validateAsync({
            animalType, 
            name, 
            registrationDate, 
            gender, 
            size, 
            description, 
            age, 
            breed,
            isAdopted
        });
        if (!req.file) {
          animal = new Animal({
            _id: mongoose.Types.ObjectId(),
            ...value
          });
        } else {
          animal = new Animal({
            _id: mongoose.Types.ObjectId(),
            ...value,
            image: fs.readFileSync(req.file.path)
          });
        }
    
        animal = await animal.save();
        res.status(201).send({
          message: 'Nowy zwierzak został zarejestrowany.',
          animal
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

//PUT METHOD
exports.updateAnimal = async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!isIdValid) {
    res.status(400).send('Podano błędny numer _id');
    return;
  }

  try {
    const { animalType, name, registrationDate, gender, size, description, age, breed, isAdopted } = req.body;
    let animal;
    await validateAnimal.validateAsync({
      animalType, 
      name, 
      registrationDate, 
      gender, 
      size, 
      description, 
      age, 
      breed,
      isAdopted
    });
  if (!req.file) {
    animal = await Animal.findByIdAndUpdate(
      req.params.id,
      {
          animalType,
          name, 
          registrationDate, 
          gender, 
          size, 
          description, 
          age, 
          breed,
          isAdopted
      },
      { new: true }
    );
  } else {
    animal = await Animal.findByIdAndUpdate(
      req.params.id,
      {
          animalType,
          name, 
          registrationDate, 
          gender, 
          size, 
          description, 
          age, 
          breed,
          isAdopted,
          image: fs.readFileSync(req.file.path),
      },
      { new: true }
    );
  }
    res.status(200).send({
      message: 'Zaktualizowano dane wybranego zwierzaka!',
      animal,
      request: {
        type: 'PUT',
        description: 'To see all animals go to:',
        url: 'http://localhost:3000/api/animals',
      },
    });
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
};

//DELETE METHOD
exports.deleteAnimal = async (req, res) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (isIdValid) {
      const animal = await Animal.findByIdAndRemove(req.params.id);
  
      if (!animal) {
        return res.status(404).send('Zwierzaka, którego szukasz, nie ma w naszej bazie danych');
      }
  
      res.status(202).send({
        message: 'Wybrany zwierzak został poprawnie usunięty z bazy danych',
        animal: animal,
        request: {
          type: 'DELETE',
          description: 'To see all animals go to:',
          url: 'http://localhost:3000/api/animals/',
        },
      });
    } else {
      res.status(400).send('Podano błędny numer _id');
    }
  };
