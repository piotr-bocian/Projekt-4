const request = require('supertest');
const volunteerForm = require('../api/controllers/volunteerForm');
const { VolunteerForm } = require('../api/models/volunteerForm');
const express = require('express');
const mongoose = require('mongoose');
const { response } = require('express');
const { func } = require('joi');
const databaseName = 'test';

const app = express();
app.use(express.json());
app.get('/test', volunteerForm.VolunteerFormGetAll);
app.get('/test/:id', volunteerForm.VolunteerFormGetOne);
app.post('/test', volunteerForm.addVolunteerForm);

const data1 = {
    _id: '60377c92f773614138a582d6',
    firstName: 'Robert',
    lastName: 'Maklowicz',
    birthDate: '1963-08-12',
    mobile: '123-456-789',
    occupation: 'youtuber',
    preferredTasks: 'praca z psami'
}

const data2 = {
  _id: '6037e7fb89718601ac3a0bf7',
  firstName: 'Krzysztof',
  lastName: 'Rutkowski',
  birthDate: '1960-04-06',
  mobile: '111-222-333',
  occupation: 'detektyw',
  preferredTasks: 'praca z psami'
}

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
  

describe('GET', () => {
    it('should return all volunteer forms', function(done){
        const volunteerForm = VolunteerForm.create(data1);
        return request(app)
            .get('/test')
            .set('Accept', 'appliacation/json')
            .expect(200)
            .then((response) => {
                expect(response.body).toStrictEqual(
                  [
                    {
                      _id: '60377c92f773614138a582d6',
                      firstName: 'Robert',
                      lastName: 'Maklowicz',
                      birthDate: '1963-08-12T00:00:00.000Z',
                      mobile: '123-456-789',
                      occupation: 'youtuber',
                      preferredTasks: 'praca z psami',
                      __v: 0
                    }
                  ]
                );
                done();
            })
            .catch((err) => done(err));
    });

    it('should return one form when valid id is given', function(done){
      const volunteerForm = VolunteerForm.create(data2);
      return request(app)
            .get('/test/6037e7fb89718601ac3a0bf7')
            .set('Accept', 'appliacation/json')
            .expect(200)
            .then((response) => {
                expect(response.body.volunteerForm).toStrictEqual(
                    {
                      _id: '6037e7fb89718601ac3a0bf7',
                      firstName: 'Krzysztof',
                      lastName: 'Rutkowski',
                      birthDate: '1960-04-06T00:00:00.000Z',
                      mobile: '111-222-333',
                      occupation: 'detektyw',
                      preferredTasks: 'praca z psami',
                      __v: 0
                    }
                );
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