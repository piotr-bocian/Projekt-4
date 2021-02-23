const mongoose = require('mongoose');
const { post } = require('../api/models/post');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

it('Should save visit to database with correct data and console.log null if everything is ok', (done) => {
  const postTest = new post({
    postDate: '2021-02-22',
    content: 'Piękny pies shih tzu - Adoptowany 2 miesiące temu z naszego schroniska',
    photo: 'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
  });
  postTest.validate((response) => {
    console.log(response);
    expect(response).toBe(null)
    done();
  });
});

it('Should console.log: postTest validation failed: content: the minimum length of the text is 50 characters', (done) => {
    const postTest = new post({
        postDate: '2021-02-22',
        content: 'Piękny pies shih tzu',
        photo: 'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
      });
      postTest.validate((response) => {
    console.log(response.message);
    expect(response.message).toBe('postTest validation failed: content: the minimum length of the text is 50 characters')
    done();
  });
});

it('Should console.log: postTest validation failed: photo: link to an external photo source is required', (done) => {
    const postTest = new post({
        postDate: '2021-02-22',
        content: 'Piękny pies shih tzu - Adoptowany 2 miesiące temu z naszego schroniska',
        photo: '',
      });
      postTest.validate((response) => {
    console.log(response.message);
    expect(response.message).toBe('postTest validation failed: photo: link to an external photo source is required')
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