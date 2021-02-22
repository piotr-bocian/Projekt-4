const mongoose = require('mongoose');
const { adoptionVisit } = require('../api/models/adoptionVisit');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

it('Should save visit to database with correct data and console.log null if everything is ok', (done) => {
  const visit = new adoptionVisit({
    visitDate: '2021-02-22',
    visitTime: '14:00',
    duration: 45,
    userID: '5099803df3f4948bd2f98391',
    isVisitDone: true
  });
  visit.validate((response) => {
    console.log(response);
    expect(response).toBe(null)
    done();
  });
});

it('Should console.log: adoptionVisit validation failed: duration: Path `duration` (4000) is more than maximum allowed value (120).', (done) => {
  const visit = new adoptionVisit({
    visitDate: '2021-06-11',
    visitTime: '13:00',
    duration: 4000,
    userID: '5099803df3f4948bd2f98391',
    isVisitDone: false
  });
    visit.validate((response) => {
    console.log(response.message);
    expect(response.message).toBe('adoptionVisit validation failed: duration: Path `duration` (4000) is more than maximum allowed value (120).')
    done();
  });
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