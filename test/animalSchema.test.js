const mongoose = require('mongoose');
const Animal = require('../api/models/animalSchema');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

describe("Animal schema tests", () =>{
    const animal = new Animal({
        type: 'dog',
        name: 'Simba',
        registrationDate: '2021-01-30',
        gender: 'male',
        size: 'medium/big',
        description: 'A true king of our shelter! Loves people, children and long walks in the park.',
        breed: 'German Shepherd'
      });

    it('Should save animal to database with correct data and console.log null if everything is ok', () => {
        animal.validate((response) => {
            expect(response).toBe(null);
        });
    });

    it('Should throw errors if object is incorrect', () => {
        animal.type = 'dogew';
        animal.description = 'test';
        animal.name = '';
        animal.gender = '';
        animal.size ='';
        animal.validate((response) => {
            expect(response.errors.type.message).toBeTruthy();
            expect(response.errors.description.message).toBeTruthy();
            expect(response.errors.name.message).toBeTruthy();
            expect(response.errors.gender.message).toBeTruthy();
            expect(response.errors.size.message).toBeTruthy();
        });
    });


})



//you have to clean the collections after the tests
async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }
  
  afterEach(async () => {
    await removeAllCollections();
  });
  //and close connection to data base
  afterAll((done) => {
    mongoose.connection.close();
    done();
  });