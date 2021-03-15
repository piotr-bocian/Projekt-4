const request = require('supertest');
const animalControllers = require('../api/controllers/animals');
const { Animal } = require('../api/models/animalSchema');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const databaseName = 'test';
const { upload } = require('../api/middleware/upload');

// here create endpoint for tests,
const app = express();
app.use(express.json());
app.get('/test', animalControllers.getAnimals);
app.get('/test/:id', animalControllers.getOneAnimal);
app.post('/test', upload.single('image'), animalControllers.addAnimal);
app.delete('/test/:id', animalControllers.deleteAnimal);
app.put('/test/:id', animalControllers.updateAnimal);

const dummyData = {
    _id: '6036925f8146b60b78d3d08d',
    animalType: 'pies',
    name: 'Tosia',
    gender: 'żeńska',
    size: 'mały',
    description: 'Melancholijna i wiecznie głodna, toleruje inne zwierzęta, póki nie zaglądają jej do miski. Dużo śpi.',
    age: 3,
    breed: 'york',
    registartionDate: '2021-03-01',
    isAdopted: false
};
const dummyData1 = {
    _id: '603b512b3e865c0e4cf63527',
    animalType: 'kot',
    name: 'Jadwiga',
    gender: 'żeńska',
    description: 'Typowy kot, niewiele ją interesuje poza jedzeniem. Indywidualistka.',
    age: 3,
    registrationDate: "2021-03-01"
};

beforeAll((done) => {
  done();
});

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

// GET ANIMALS TEST

describe('GET', () => {
    it('should get all data from database', function (done) {
      const testAnimal = Animal.create(dummyData);
      return request(app)
        .get('/test')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.body.animals.allAnimalsInDatabase).toStrictEqual(1);
          done();
        })
        .catch((err) => done(err));
    });

    it('should response with status 200 when correct id is sending', function (done) {
        const testAnimal = Animal.create(dummyData1);
        return request(app)
          .get('/test/603b512b3e865c0e4cf63527')
          .set('Accept', 'application/json')
          .expect(200)
          .then((response) => {
            expect(response.body.animal).toStrictEqual({
                _id: '603b512b3e865c0e4cf63527',
                animalType: 'kot',
                name: 'Jadwiga',
                gender: 'żeńska',
                description: 'Typowy kot, niewiele ją interesuje poza jedzeniem. Indywidualistka.',
                age: 3,
                registrationDate: "2021-03-01T00:00:00.000Z",
                isAdopted: false,
                __v: 0
            });
            done();
          })
          .catch((err) => done(err));
      });

      it('should response with status 404 when incorrect id is sent, else it should response with: Zwierzaka, którego szukasz, nie ma w naszej bazie danych', function (done) {
        return request(app)
          .get('/test/6incorrectid')
          .set('Accept', 'application/json')
          .expect(404, 'Zwierzaka, którego szukasz, nie ma w naszej bazie danych')
          .then((response) => {
            expect(response.text).toBe('Zwierzaka, którego szukasz, nie ma w naszej bazie danych');
            done();
          })
          .catch((err) => done(err));
      });

});

//POST ANIMAL TEST

describe('POST', () => {

    it('should respond with status 201', function (done) {
      const postData = {
        _id: '603b512b3e865c0e4cf63527',
        animalType: 'kot',
        name: 'Jadwiga',
        gender: 'żeńska',
        description: 'Typowy kot, niewiele ją interesuje poza jedzeniem. Indywidualistka.',
        age: 3,
        registrationDate: "2021-03-01",
        isAdopted: false
      };

      request(app)
        .post('/test')
        .send(postData)
        .set('Accept', 'application/json')
        .expect(201)
        .end(function (err, res) {
          expect(res.body.message).toBe('Nowy zwierzak został zarejestrowany.');
          if (err) return done(err);
          return done();
        });
    });

    it('should respond with status 400 when incorrect data are send, it should also send: animalType" must be one of [pies, kot, inne]', function (done) {
        const postData = {
            _id: '603b512b3e865c0e4cf63527',
            animalType: 'żółw',
            name: 'Jadwiga',
            gender: 'żeńska',
            description: 'Typowy kot, niewiele ją interesuje poza jedzeniem. Indywidualistka.',
            age: 3
        }
    
        request(app)
          .post('/test')
          .send(postData)
          .set('Accept', 'application/json')
          .expect(400)
          .end(function (err, res) {
            expect(res.text).toBe(
              '"animalType" must be one of [pies, kot, inne]'
            );
            if (err) return done(err);
            return done();
          });
      });
});

//DELETE ANIMAL TEST

describe('DELETE', () => {
    it('should response with status 400 and send: Podano błędny numer _id', function (done) {
      return request(app)
        .delete('/test/incorrectid')
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
          expect(response.text).toBe('Podano błędny numer _id');
          done();
        })
        .catch((err) => done(err));
    });

    it('should response with status 202 and send: Wybrany zwierzak został poprawnie usunięty z bazy danych', function (done) {
        const dummyDataDelete = {
            _id: '60369dc3e954c736b94a1212',
            animalType: 'pies',
            name: 'Doduś',
            gender: 'męska',
            size: 'mały',
            description: 'Mały czarny kundelek, ewidentnie długowieczny. Lubi przekopywać się pod płotem i zwiedzać okolice.',
            age: 15
        };
        const testAnimal = Animal.create(dummyDataDelete);
        return request(app)
          .delete('/test/60369dc3e954c736b94a1212')
          .set('Accept', 'application/json')
          .expect(202)
          .then((response) => {
            expect(response.body.message).toBe(
              'Wybrany zwierzak został poprawnie usunięty z bazy danych'
            );
            done();
          })
          .catch((err) => done(err));
      });

});

//PUT ANIMAL TEST

describe('PUT', () => {
    it('should update the animal and response with status 200 and send: Zaktualizowano dane wybranego zwierzaka!', function (done) {
      const dummyDataForUpdate = {
        _id: '99999dc3e954c736b94a12f7',
        animalType: 'pies',
        name: 'Doduś',
        gender: 'męska',
        size: 'mały',
        description: 'Mały czarny kundelek, ewidentnie długowieczny. Lubi przekopywać się pod płotem i zwiedzać okolice.',
        age: 15,
        isAdopted: false
      };
  
      const putData = {
        animalType: 'pies',
        name: 'Dodo',
        gender: 'męska',
        size: 'mały/średni',
        description: 'Mały czarny kundelek, ewidentnie długowieczny. Lubi przekopywać się pod płotem i zwiedzać okolice.',
        age: 17,
        isAdopted: true
      };
  
      const post = Animal.create(dummyDataForUpdate);
      return request(app)
        .put('/test/99999dc3e954c736b94a12f7')
        .send(putData)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe('Zaktualizowano dane wybranego zwierzaka!');
          done();
        })
        .catch((err) => done(err));
    });
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterAll(async () => {
  await removeAllCollections();
});