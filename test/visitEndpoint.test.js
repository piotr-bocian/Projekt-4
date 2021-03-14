const request = require('supertest');
const visitControllers = require('../api/controllers/adoptionVisit');
const { adoptionVisit } = require('../api/models/adoptionVisit');
const express = require('express');
const mongoose = require('mongoose');
const databaseName = 'test';

// here create endpoint for tests,
const app = express();
app.use(express.json());

app.get('/test', visitControllers.getAllVisits);
app.get('/test/:id', visitControllers.getVisit);
app.post('/test', visitControllers.makeVisit);
app.delete('/test/:id', visitControllers.deleteVisit);
app.put('/test/:id', visitControllers.updateVisit);

const dummyData = {
  _id: "5099803df3f4948bd2f98113",
  visitDate: "2021-03-22",
  visitTime: "12:30",
  duration: 45,
  userID: "5099803df3f4948bd2f98113",
  isVisitDone: false
};

const dummyData2 = {
  _id: "7199803df3f4948bd2f98113",
  visitDate: "2021-01-14",
  visitTime: "16:45",
  duration: 60,
  userID: "9999803df3f4948bd2f98113",
  isVisitDone: true
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
  it('should get all data from database', function (done) {
    const post = adoptionVisit.create(dummyData);
    return request(app)
      .get('/test')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.allVisitsInDatabase).toStrictEqual(1); //
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
    const post = adoptionVisit.create(dummyData2);
    return request(app)
      .get('/test/7199803df3f4948bd2f98113')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.visit).toStrictEqual({ //
          _id: "7199803df3f4948bd2f98113",
          visitDate: "2021-01-14T00:00:00.000Z",
          visitTime: "16:45",
          duration: 60,
          userID: "9999803df3f4948bd2f98113",
          isVisitDone: true,
          __v: 0,
        });
        done();
      })
      .catch((err) => done(err));
  });
  it('should response with status 404 when incorrect id is sending, alse it should response with: Wizyta adopcyjna, której szukasz nie istnieje', function (done) {
    return request(app)
      .get('/test/6incorrectid')
      .set('Accept', 'application/json')
      .expect(404, 'Wizyta adopcyjna, której szukasz nie istnieje')
      .then((response) => {
        expect(response.text).toBe('Wizyta adopcyjna, której szukasz nie istnieje');
        done();
      })
      .catch((err) => done(err));
  });
});

// 'POST /test'
describe('POST', () => {
  it('should respond with status 201', function (done) {
    const postData = {
    visitDate: "2021-03-01",
    visitTime: "11:30",
    duration: 45,
    userID: "5199803df3f4948bd2f98113",
    isVisitDone: false
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        expect(res.body.message).toBe('Rezerwacja wizyty adopcyjnej przebiegła pomyślnie');
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with status 400 when incorrect data are sended, it should also send: duration" must be less than or equal to 120', function (done) {
    const postData = {
      visitDate: "2021-03-01",
      visitTime: "11:30",
      duration: 99999,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err, res) {
        expect(res.text).toBe(
          '"duration" must be less than or equal to 120'
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
        // console.log(response.text);
        expect(response.text).toBe('Podano błędny numer _id');
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 404 and send: Wizyta adopcyjna, której szukasz nie istnieje', function (done) {
    const dummyDataDelete = {
      _id: '60369dc3e954c736b94a12f5',
      visitDate: "2021-03-01",
      visitTime: "11:30",
      duration: 50,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };
    const post = adoptionVisit.create(dummyDataDelete);
    return request(app)
      .delete('/test/60369dc3e954c736b94a12f0')
      .set('Accept', 'application/json')
      .expect(404)
      .then((response) => {
        expect(response.text).toBe('Wizyta adopcyjna, której szukasz nie istnieje');
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 202 and send: Wizyta adopcyjna została poprawnie anulowana', function (done) {
    const dummyDataDelete = {
      _id: '99369dc3e954c736b94a12f5',
      visitDate: "2021-03-01",
      visitTime: "11:30",
      duration: 50,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };
    const post = adoptionVisit.create(dummyDataDelete);
    return request(app)
      .delete('/test/99369dc3e954c736b94a12f5')
      .set('Accept', 'application/json')
      .expect(202)
      .then((response) => {
        expect(response.body.message).toBe(
          'Wizyta adopcyjna została poprawnie anulowana'
        );
        done();
      })
      .catch((err) => done(err));
  });
});

// PUT /test
describe('PUT', () => {
  it('should update payment and response with status 200 and send: Zaktualizowano wizytę adopcyjną', function (done) {
    const dummyDataForUpdate = {
      _id: '99999dc3e954c736b94a12f5',
      visitDate: "2021-03-01",
      visitTime: "11:30",
      duration: 50,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    const putData = {
      visitDate: "2021-03-03",
      visitTime: "12:30",
      duration: 50,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    const post = adoptionVisit.create(dummyDataForUpdate);
    return request(app)
      .put('/test/99999dc3e954c736b94a12f5')
      .send(putData)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('Zaktualizowano wizytę adopcyjną');
        done();
      })
      .catch((err) => done(err));
  });

  it('should update payment and response with status 400 and send: Podano błędny numer _id', function (done) {
    const dummyDataForUpdate = {
      _id: '33333dc3e954c736b94a12f5',
      visitDate: "2021-03-03",
      visitTime: "12:30",
      duration: 50,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    const putData = {
      visitDate: "2021-03-03",
      visitTime: "12:30",
      duration: 60,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    const post = adoptionVisit.create(dummyDataForUpdate);
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

  it('should update payment and response with status 400 when incorrect data are send also it should response with : duration" must be less than or equal to 120', function (done) {
    const dummyDataForUpdate = {
      _id: '56789dc3e954c736b94a12f5',
      visitDate: "2021-03-03",
      visitTime: "12:30",
      duration: 60,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    const putData = {
      visitDate: "2021-04-03",
      visitTime: "09:30",
      duration: 11111,
      userID: "5199803df3f4948bd2f98113",
      isVisitDone: false
    };

    const post = adoptionVisit.create(dummyDataForUpdate);
    return request(app)
      .put('/test/56789dc3e954c736b94a12f5')
      .send(putData)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(
          '"duration" must be less than or equal to 120'
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