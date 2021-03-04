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
app.patch('/test/:id', volunteerForm.updateVolunteerFormProperty);
app.delete('/test/:id', volunteerForm.deleteVolunteerForm);

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

describe('POST', () => {
  it('should respond with status 201', function(done){
    const newForm = {
      firstName: 'Krzysztof',
      lastName: 'Rutkowski',
      birthDate: '1960-04-06',
      mobile: '111-222-333',
      occupation: 'detektyw',
      preferredTasks: 'praca z psami'
    }

    request(app)
      .post('/test')
      .send(newForm)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(error, response){
        expect(response.body.message).toBe('Formularz zostal zapisany');
        if(error) return done(error);
        return done();
      });
  });

  it('should respond with status 400 when incorrect data are being sent also should send: "preferredTasks" must be one of [praca z psami, praca z kotami, promocja schroniska]', function(done){
    const newForm = {
      firstName: 'Krzysztof',
      lastName: 'Rutkowski',
      birthDate: '1960-04-06',
      mobile: '111-222-333',
      occupation: 'detektyw',
      preferredTasks: 'praca z wielbladami'
    }

    request(app)
      .post('/test')
      .send(newForm)
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(error, response){
        expect(response.text).toBe('"preferredTasks" must be one of [praca z psami, praca z kotami, promocja schroniska]');
        if(error) return done(error);
        return done();
      });
  });
});

describe('PATCH', () => {
  it('should response with status 200 and send: Zaktualizowano nastepujące pola {"mobile":"125-152-144"}', function(done){
    const patchDummy = {
      _id: '6037e7fb89718601ac3a0bf0',
      firstName: 'Krzysztof',
      lastName: 'Rutkowski',
      birthDate: '1960-04-06',
      mobile: '111-222-333',
      occupation: 'detektyw',
      preferredTasks: 'praca z psami'
    }
    const form = VolunteerForm.create(patchDummy);

    const patchData = [{propertyName: 'mobile', newValue: '125-152-144'}];

    return request(app)
      .patch('/test/6037e7fb89718601ac3a0bf0')
      .send(patchData)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe(
          'Zaktualizowano nastepujące pola {"mobile":"125-152-144"}'
        );
        done();
      })
      .catch((error) => done(error));
  });

  it('should response with status 400 and send: "preferredTasks" must be one of [praca z psami, praca z kotami, promocja schroniska]', function (done){
    const patchDummy = {
      _id: '6037e7fb89718601ac3a0bf5',
      firstName: 'Krzysztof',
      lastName: 'Rutkowski',
      birthDate: '1960-04-06',
      mobile: '111-222-333',
      occupation: 'detektyw',
      preferredTasks: 'praca z psami'
    }
    const form = VolunteerForm.create(patchDummy);

    const patchData = [{propertyName: 'preferredTasks', newValue: 'praca z orangutanami'}];
    
    return request(app)
      .patch('/test/6037e7fb89718601ac3a0bf5')
      .send(patchData)
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(
          '"preferredTasks" must be one of [praca z psami, praca z kotami, promocja schroniska]'
        );
        done();
      })
      .catch((error) => done(error));
  });
})

describe('DELETE', () => {
  it('should respond with status 202 and send: Formularz zostal poprawnie usuniety z bazy danych', function(done){
    const deleteDummy = {
      _id: '6037e7fb89718601ac3a0bf1',
      firstName: 'Krzysztof',
      lastName: 'Rutkowski',
      birthDate: '1960-04-06',
      mobile: '111-222-333',
      occupation: 'detektyw',
      preferredTasks: 'praca z psami'
    }
    const form = VolunteerForm.create(deleteDummy);

    return request(app)
      .delete('/test/6037e7fb89718601ac3a0bf1')
      .set('Accept', 'application/json')
      .expect(202)
      .then((response) => {
        expect(response.body.message).toBe(
          'Formularz zostal poprawnie usuniety z bazy danych'
        );
        done();
      })
      .catch((error) => done(error));
  });

  it('should respond with status 404 and send: Taki formularz nie figuruje w naszej bazie danych', function(done){
    const deleteDummy = {
      _id: '6037e7fb89718601ac3a0bf2',
      firstName: 'Krzysztof',
      lastName: 'Rutkowski',
      birthDate: '1960-04-06',
      mobile: '111-222-333',
      occupation: 'detektyw',
      preferredTasks: 'praca z psami'
    }
    const form = VolunteerForm.create(deleteDummy);

    return request(app)
      .delete('/test/6037e7fb89718601ac3a0bf3')
      .set('Accept', 'application/json')
      .expect(404)
      .then((response) => {
        expect(response.text).toBe(
          'Taki formularz nie figuruje w naszej bazie danych'
        );
        done();
      })
      .catch((error) => done(error));
  });
})


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