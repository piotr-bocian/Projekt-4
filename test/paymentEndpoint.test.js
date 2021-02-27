const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll((done) => {
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
describe('GET request, should response with status 200', function () {
  it('should get all data from database', function (done) {
    return request(app)
      .get('/api/payments')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        console.log(response.body.request);
        done();
      })
      .catch((err) => done(err));
  });

  it('should get one document from database', function (done) {
    return request(app)
      .get('/api/payments/60369dc3e954c736b94a12f7')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        console.log(response.body);
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 400 when incorrect id is sending', function (done) {
    return request(app)
      .get('/api/payments/incorectid')
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 404 when incorrect id is sending but with correct syntax', function (done) {
    return request(app)
      .get('/api/payments/60369dc3e954c736b93a11f7')
      .set('Accept', 'application/json')
      .expect(404)
      .then((response) => {
        done();
      })
      .catch((err) => done(err));
  });
});

// describe('POST /test', function() {
//    it('user.name should be an case-insensitive match for "john"', function(done) {
//      request(app)
//        .post('/test')
//        .send('amount=123') // x-www-form-urlencoded upload
//        .set('Accept', 'application/json')
//        .expect(function(res) {
//          res.body.id = 'some fixed id';
//          res.body.name = res.body.name;
//        })
//        .expect(200, {
//          amount: '123'
//        }, done);
//    });
//  });

//  describe('POST /test', function() {
//    it('responds with json', function(done) {
//      request(app)
//        .post('/test')
//        .send({amount: '123'})
//        .set('Accept', 'application/json')
//        .expect('Content-Type', /json/)
//        .expect(200)
//        .end(function(err, res) {
//          if (err) return done(err);
//          return done();
//        });
//    });
//  });
