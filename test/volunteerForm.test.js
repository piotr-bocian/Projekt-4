const mongoose = require('mongoose');
const {VolunteerForm} = require('../api/models/volunteerForm');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

it('Should save volunteer form to the database and console.log null if evertything is ok', (done) => {
    const volunteerForm = new VolunteerForm({
        firstName: 'Robert',
        lastName: 'Maklowicz',
        birthDate: '1963-08-12',
        mobile: '123-456-789',
        occupation: 'youtuber',
        preferredTasks: 'praca z psami'
    });
    volunteerForm.validate((response) => {
        console.log(response);
        expect(response).toBe(null);
        done();
    });
});

it('Should console.log: Payment validation failed: preferredTasks: `praca ze slimakami` is not a valid enum value for path `preferredTasks` when data are incorrect. preferredTasks expects one of the values: `praca z psami`, `praca z kotami`, `promocja schroniska`', (done) => {
  const volunteerForm = new VolunteerForm({
    firstName: 'Robert',
    lastName: 'Maklowicz',
    birthDate: '1963-08-12',
    mobile: '123-456-789',
    occupation: 'youtuber',
    preferredTasks: 'praca ze slimakami'
  });
  volunteerForm.validate((response => {
    console.log(response.message);
    expect(response.message).toBe('VolunteerForm validation failed: preferredTasks: `praca ze slimakami` is not a valid enum value for path `preferredTasks`.');
    done();
  }));
});

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