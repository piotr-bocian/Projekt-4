const mongoose = require('mongoose');
const { adoptionForm } = require('../api/models/adoptionForm');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

it('Should save adoption text to database with correct userID and console.log null if everything is ok', (done) => {
  const adoptionFormTest = new adoptionForm({
    content: 'Hello, How are U',
    userID: '5099803df3f4948bd2f98391',
    animalID: '5099803df3f4948bd2f98392'
  });
  adoptionFormTest.validate((response) => {
    console.log(response);
    expect(response).toBe(null)
    done();
  });
});

// it('Should console.log: adoptionFormTest validation failed: content: some text is required', (done) => {
//     const adoptionFormTest = new adoptionForm({
//         content: 'Hello, How are U',
//         userID: '5099803df3f4948bd2f98391',
//         animalID: '5099803df3f4948bd2f9839'
//       });
//       adoptionFormTest.validate((response) => {
//     console.log(response.message);
//     expect(response.message).toBe('adoptionFormTest validation failed: content: some text is required')
//     done();
//   });
// });
// it('Should console.log: postTest validation failed: duration: userID: userId is required', (done) => {
//     const adoptionFormTest = new adoptionForm({
//         content: 'Hello, How are U',
//         userID: '5123',
//         animalID: '5099803df3f4948bd2f98392'
//       });
//       adoptionFormTest.validate((response) => {
//     console.log(response.message);
//     expect(response.message).toBe('adoptionFormTest validation failed: userID: userId is required')
//     done();
//   });
// });

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