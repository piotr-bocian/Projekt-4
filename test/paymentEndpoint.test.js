const request = require('supertest');
// const app = require('../app');
const payment = require('../api/controllers/payments');
const {
  Payment,
  validatePayment,
  validatePatchUpdate,
} = require('../api/models/paymentSchema');
const express = require('express');
const mongoose = require('mongoose');
const databaseName = 'test';

const app = express();
app.get('/test', payment.getAllPayments);
app.get('/test/:id', payment.getOnePayment);
app.post('/test', payment.makeAPayment);

const dummyData = {
  _id: '60369dc3e954c736b94a12f3',
  typeOfPayment: 'opłata adopcyjna',
  amount: 19,
  paymentDate: '2021-05-05',
  paymentMethod: 'Blik',
};
const dummyData2 = {
  _id: '60369dc3e954c736b94a12f9',
  typeOfPayment: 'opłata adopcyjna',
  amount: 345,
  paymentDate: '2021-05-05',
  paymentMethod: 'Blik',
};

beforeAll((done) => {
  done();
});

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('GET request', function () {
  it('should get all data from database', function (done) {
    const post = Payment.create(dummyData);
    return request(app)
      .get('/test')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        console.log(response.body.payments);
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 400 when incorrect id is sending also it should return: Podano błędny numer _id', function (done) {
    return request(app)
      .get('/test/incorectid')
      .set('Accept', 'application/json')
      .expect(400, 'Podano błędny numer _id')
      .then((response) => {
        console.log(response.text);
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 200 when correct id is sending', function (done) {
    const post = Payment.create(dummyData2);
    return (
      request(app)
        .get('/test/60369dc3e954c736b94a12f9')
        .set('Accept', 'application/json')
        .expect(200)
        // .expect(404, 'Płatność, której szukasz nie istnieje')
        .then((response) => {
          console.log(response.body);
          done();
        })
        .catch((err) => done(err))
    );
  });
  it('should response with status 404 when incorrect id is sending, alse it should response with: Płatność, której szukasz nie istnieje', function (done) {
    return (
      request(app)
        .get('/test/6incorrectid')
        .set('Accept', 'application/json')
        .expect(404, 'Płatność, której szukasz nie istnieje')
        .then((response) => {
          console.log(response.body);
          done();
        })
        .catch((err) => done(err))
    );
  });
});

// describe('POST request', function () {
//   it('should response with status 400 when incorrect data are sended', function (done) {
//     request(app)
//       .post('/test')
//       .send(dummyData)
//       .set('Accept', 'application/json')
//       .expect(400)
//       .then((response) => {
//         console.log(response.body);
//         done();
//       })
//       .catch((err) => done(err));
//   });
//   // it('should response with status 400 when incorrect data are sended', function (done) {
//   //   request(app)
//   //     .post('/test')
//   //     .send({
//   //       typeOfPayment: 'opłata adopcyjna',
//   //       amount: 13209090,
//   //       paymentDate: '2021-05-05',
//   //       paymentMethod: 'Google Pay',
//   //     })
//   //     .set('Accept', 'application/json')
//   //     .expect(201)
//   //     .then((response) => {
//   //       console.log(response.body);
//   //       done();
//   //     })
//   //     .catch((err) => done(err));
//   // });
// });

//you have to clean the collections after the tests
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
