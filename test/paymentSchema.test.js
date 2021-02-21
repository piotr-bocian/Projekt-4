const mongoose = require('mongoose');
const { Payment } = require('../api/models/paymentSchema');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

it('Should save payment to database with correct data and console.log null if everything is ok', (done) => {
  const payment = new Payment({
    typeOfPayment: 'jednorazowy przelew',
    amount: 10,
    paymentDate: '2021-02-22',
    paymentMethod: 'Blik',
  });
  payment.validate((response) => {
    console.log(response);
    expect(response).toBe(null)
    done();
  });
});

it('Should console.log: Payment validation failed: typeOfPayment: `kot` is not a valid enum value for path `typeOfPayment` when data are incorrect. typeOfPayment expects one of the values: opłata adopcyjna, jednorazowy przelew, wirtualny opiekun-opłata cykliczna', (done) => {
  const payment = new Payment({
    typeOfPayment: 'kot',
    amount: 10,
    paymentDate: '2021-02-22',
    paymentMethod: 'Blik',
  });
    payment.validate((response) => {
    console.log(response.message);
    expect(response.message).toBe('Payment validation failed: typeOfPayment: `kot` is not a valid enum value for path `typeOfPayment`.')
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
