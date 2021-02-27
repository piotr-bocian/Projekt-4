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
const { describe } = require('yargs');
const databaseName = 'test';

const app = express();
app.use(express.json());
app.get('/test', payment.getAllPayments);
app.get('/test/:id', payment.getOnePayment);
app.post('/test', payment.makeAPayment);
// app.delete('/test/:id', payment.deleteOnePayment);

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

// describe('GET /test', function () {
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
    return request(app)
      .get('/test/60369dc3e954c736b94a12f9')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        console.log(response.body);
        done();
      })
      .catch((err) => done(err));
  });
  it('should response with status 404 when incorrect id is sending, alse it should response with: Płatność, której szukasz nie istnieje', function (done) {
    return request(app)
      .get('/test/6incorrectid')
      .set('Accept', 'application/json')
      .expect(404, 'Płatność, której szukasz nie istnieje')
      .then((response) => {
        console.log(response.body);
        done();
      })
      .catch((err) => done(err));
  });
// });

// describe('POST /test', function () {
  it('should respond with status 201', function (done) {
    const postData = {
      typeOfPayment: 'opłata adopcyjna',
      amount: 25,
      paymentDate: '2021-07-09',
      paymentMethod: 'Blik',
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message).toBe('Płatność przebiegła pomyślnie');
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with status 400 when incorrect data are sended', function (done) {
    const postData = {
      typeOfPayment: 'bad data',
      amount: 25,
      paymentDate: '2021-07-09',
      paymentMethod: 'Blik',
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err, res) {
        expect(res.text).toBe(
          '"typeOfPayment" must be one of [opłata adopcyjna, jednorazowy przelew, wirtualny opiekun-opłata cykliczna]'
        );
        if (err) return done(err);
        return done();
      });
  });
// });

  it('should delete data from database', function (done) {
    const dummyData = {
      _id: '60369dc3e954c736b94a12f5',
      typeOfPayment: 'opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };
    const post = Payment.create(dummyData);
    return request(app)
      .delete('/test/60369dc3e954c736b94a12f5')
      .set('Accept', 'application/json')
      .expect(202)
      .then((response) => {
        console.log(response.text);
        done();
      })
      .catch((err) => done(err));
  });


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
