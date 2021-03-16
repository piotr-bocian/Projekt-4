const request = require('supertest');
const payment = require('../api/controllers/payments');
const { Payment } = require('../api/models/paymentSchema');
const express = require('express');
const mongoose = require('mongoose');
const databaseName = 'test';

// here create endpoint for tests,
const app = express();
app.use(express.json());
app.get('/test', payment.getAllPayments);
app.get('/test/:id', payment.getOnePayment);
app.post('/test', payment.makeAPayment);
app.delete('/test/:id', payment.deleteOnePayment);
app.put('/test/:id', payment.updateOnePayment);
app.patch('/test/:id', payment.updateOnePropertyInPayment);

const dummyData = {
  _id: '60369dc3e954c736b94a12f3',
  typeOfPayment: 'Opłata adopcyjna',
  amount: 19,
  paymentDate: '2021-05-05',
  paymentMethod: 'Blik',
};
const dummyData2 = {
  _id: '60369dc3e954c736b94a12f9',
  typeOfPayment: 'Opłata adopcyjna',
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

// 'GET /test'
describe('GET', () => {
  it('should get all data from database', async function (done) {
    const post = await Payment.create(dummyData);
    return request(app)
      .get('/test')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.payments.allPaymentsInDatabase).toStrictEqual(1);
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
        expect(response.text).toBe('Podano błędny numer _id');
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
        expect(response.body.payment).toStrictEqual({
          _id: '60369dc3e954c736b94a12f9',
          typeOfPayment: 'Opłata adopcyjna',
          amount: 345,
          paymentDate: '2021-05-05T00:00:00.000Z',
          paymentMethod: 'Blik',
          __v: 0,
        });
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
        expect(response.text).toBe('Płatność, której szukasz nie istnieje');
        done();
      })
      .catch((err) => done(err));
  });
});

// 'POST /test'
describe('POST', () => {
  it('should respond with status 201', function (done) {
    const postData = {
      typeOfPayment: 'Opłata adopcyjna',
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

  it('should respond with status 400 when incorrect data are sended, it should also send: typeOfPayment" must be one of [opłata adopcyjna, jednorazowy przelew, wirtualny opiekun-opłata cykliczna]', function (done) {
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
          '"typeOfPayment" must be one of [Opłata adopcyjna, Jednorazowy przelew, Wirtualny opiekun-opłata cykliczna]'
        );
        if (err) return done(err);
        return done();
      });
  });
});

// DELETE /test
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

  it('should response with status 404 and send: Płatność, której szukasz nie istnieje', function (done) {
    const dummyDataDelete = {
      _id: '60369dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };
    const post = Payment.create(dummyDataDelete);
    return request(app)
      .delete('/test/60369dc3e954c736b94a12f0')
      .set('Accept', 'application/json')
      .expect(404)
      .then((response) => {
        expect(response.text).toBe('Płatność, której szukasz nie istnieje');
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 202 and send: Płatność została poprawnie usunieta z bazy danych', function (done) {
    const dummyDataDelete = {
      _id: '99369dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };
    const post = Payment.create(dummyDataDelete);
    return request(app)
      .delete('/test/99369dc3e954c736b94a12f5')
      .set('Accept', 'application/json')
      .expect(202)
      .then((response) => {
        expect(response.body.message).toBe(
          'Płatność została poprawnie usunieta z bazy danych'
        );
        done();
      })
      .catch((err) => done(err));
  });
});

// PUT /test
describe('PUT', () => {
  it('should update payment and response with status 200 and send: Zaktualizowana płatność', function (done) {
    const dummyDataForUpdate = {
      _id: '99999dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };

    const putData = {
      typeOfPayment: 'Opłata adopcyjna',
      amount: 25,
      paymentDate: '2021-07-09',
      paymentMethod: 'Blik',
    };

    const post = Payment.create(dummyDataForUpdate);
    return request(app)
      .put('/test/99999dc3e954c736b94a12f5')
      .send(putData)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Zaktualizowana płatność');
        done();
      })
      .catch((err) => done(err));
  });

  it('should update payment and response with status 400 and send: Podano błędny numer _id', function (done) {
    const dummyDataForUpdate = {
      _id: '33333dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };

    const putData = {
      typeOfPayment: 'Opłata adopcyjna',
      amount: 25,
      paymentDate: '2021-07-09',
      paymentMethod: 'Blik',
    };

    const post = Payment.create(dummyDataForUpdate);
    return request(app)
      .put('/test/10101dc3e954c736b94a')
      .send(putData)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.text).toBe('Podano błędny numer _id');
        done();
      })
      .catch((err) => done(err));
  });

  it('should update payment and response with status 400 when incorrect data are send also it should response with : paymentMethod" must be one of [Karta płatnicza, Blik, Przelew bankowy, Apple Pay, Google Pay]', function (done) {
    const dummyDataForUpdate = {
      _id: '56789dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };

    const putData = {
      typeOfPayment: 'Jednorazowy przelew',
      amount: 25,
      paymentDate: '2021-07-09',
      paymentMethod: 'nothing',
    };

    const post = Payment.create(dummyDataForUpdate);
    return request(app)
      .put('/test/56789dc3e954c736b94a12f5')
      .send(putData)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(
          '"paymentMethod" must be one of [Karta płatnicza, Blik, Przelew bankowy, Apple Pay, Google Pay]'
        );
        done();
      })
      .catch((err) => done(err));
  });
});

// PATCH /test
describe('PATCH', () => {
  it('should response with status 200 and send message: Zaktualizowano nastepujące pola {"amount":7}', function (done) {
    const dummyDataForPatch = {
      _id: '77777dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };

    const patchData = [{ propertyName: 'amount', newValue: 7 }];

    const post = Payment.create(dummyDataForPatch);
    return request(app)
      .patch('/test/77777dc3e954c736b94a12f5')
      .send(patchData)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe(
          'Zaktualizowano nastepujące pola {"amount":7}'
        );
        done();
      })
      .catch((err) => done(err));
  });
  it('should response with status 400 and send message: "amount" must be greater than or equal to 5', function (done) {
    const dummyDataForPatch = {
      _id: '10000dc3e954c736b94a12f5',
      typeOfPayment: 'Opłata adopcyjna',
      amount: 19,
      paymentDate: '2021-05-05',
      paymentMethod: 'Blik',
    };

    const patchData = [{ propertyName: 'amount', newValue: 1 }];

    const post = Payment.create(dummyDataForPatch);
    return request(app)
      .patch('/test/10000dc3e954c736b94a12f5')
      .send(patchData)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(
          '"amount" must be greater than or equal to 5'
        );
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
