const request = require('supertest');
const userController = require('../api/controllers/user');
const { User } = require('../api/models/user');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const databaseName = 'test';
const { upload } = require('../api/middleware/upload');

// here create endpoint for tests,
const app = express();
app.use(express.json());

app.get('/test', userController.usersGetAll);
app.get('/test/:id', userController.usersGetUser);
app.post('/test', upload.single('image'), userController.usersAddUser);
app.patch('/test/:id', userController.usersUpdateUser);
app.delete('/test/:id', userController.usersDeleteUser);

const dummyUserA = {
    _id: "603d60be60915444eb7b7f91",
    isSuperAdmin: false,
    isAdmin: false,
    isVolunteer: false,
    firstName: "Adam",
    lastName: "Adamczyk",
    email: "aadamczyk15@gmail.com",
    password: 'Aa123456',
    mobile: "123-123-123"
};
const dummyUserB = {
    _id: "603812100b344261dda8c175",
    isSuperAdmin: false,
    isAdmin: false,
    isVolunteer: false,
    firstName: "Brajan",
    lastName: "Brajanski",
    email: "brajan@gmail.com",
    password: 'Bb123456',
    mobile: "789-456-654"
};

beforeAll((done) => {
  done();
});

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

// GET USERS TEST

describe('GET', () => {
    it('should get all data from database', async function (done) {
      const testUser = await User.create(dummyUserA);
      return request(app)
        .get('/test')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.body.users.allUsersInDatabase).toStrictEqual(1);
          done();
        })
        .catch((err) => done(err));
    });

    it('should response with status 200 when correct id is sent', function (done) {
        const testUser = User.create(dummyUserB);
        return request(app)
          .get('/test/603812100b344261dda8c175')
          .set('Accept', 'application/json')
          .expect(200)
          .then((response) => {
            expect(response.body).toStrictEqual({
              _id: "603812100b344261dda8c175",
              isSuperAdmin: false,
              isAdmin: false,
              isVolunteer: false,
              firstName: "Brajan",
              lastName: "Brajanski",
              email: "brajan@gmail.com",
              mobile: "789-456-654",
              __v: 0
            });
            done();
          })
          .catch((err) => done(err));
      });

      it('should response with status 404 when incorrect id is sent, else it should response with: Podany użytkownik nie istnieje.', function (done) {
        return request(app)
          .get('/test/6incorrectid')
          .set('Accept', 'application/json')
          .expect(404)
          .then((response) => {
            expect(response.body.message).toMatch('Podany użytkownik nie istnieje.');
            done();
          })
          .catch((err) => done(err));
      });

});

// //POST USER TEST

describe('POST', () => {

    it('should respond with status 201', function (done) {
      const postData = {
        isSuperAdmin: false,
        isAdmin: false,
        isVolunteer: false,
        firstName: "Brajan",
        lastName: "Brajanski",
        email: "brajan1@gmail.com",
        password: 'Bb123456',
        mobile: "789-456-654"
      };

      request(app)
        .post('/test')
        .send(postData)
        .set('Accept', 'application/json')
        .expect(201)
        .end(function (err, res) {
          expect(res.body.message).toBe('Rejestracja przebiegła pomyślnie.');
          if (err) return done(err);
          return done();
        });
    });

    it('should respond with status 400 when incorrect data is send, it should also send a message which contains: Pole imię musi zawierać tylko litery', function (done) {
        const postData = {
          isSuperAdmin: false,
          isAdmin: false,
          isVolunteer: false,
          firstName: "123456",
          lastName: "Brajanski",
          email: "brajan2@gmail.com",
          password: 'Bb123456',
          mobile: "789-456-654"
        }
    
        request(app)
          .post('/test')
          .send(postData)
          .set('Accept', 'application/json')
          .expect(400)
          .end(function (err, res) {
            expect(res.text).toMatch(
              'fails to match the required pattern'
            );
            if (err) return done(err);
            return done();
          });
      });
});

// //DELETE USER TEST

describe('DELETE', () => {
    it('should response with status 400 and send: Podano błędny numer id', function (done) {
      return request(app)
        .delete('/test/incorrectId')
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Podano błędny numer id.');
          done();
        })
        .catch((err) => done(err));
      });

    it('should response with status 202 and send: Pomyślnie usunięto konto użytkownika.', function (done) {
        const dummyUserDelete = {
            _id: '60369dc3e954c736b94a1214',
            isSuperAdmin: false,
            isAdmin: false,
            isVolunteer: false,
            firstName: "Brajan",
            lastName: "Brajanski",
            email: "bra@gmail.com",
            password: "Bb123456",
            mobile: "789-456-654",
        };
        const testUser = User.create(dummyUserDelete);
        return request(app)
          .delete('/test/60369dc3e954c736b94a1214')
          .set('Accept', 'application/json')
          .expect(202)
          .then((response) => {
            expect(response.body.message).toBe(
              'Pomyślnie usunięto konto użytkownika.'
            );
            done();
          })
          .catch((err) => done(err));
      });

});

// //PATCH USER TEST

describe('PATCH', () => {
    it('should update the given user and response with status 200 and send: Zaktualizowano następujące pola: and list updated fields', function (done) {
      const dummyUserForUpdate = {
        _id: '99999dc3e954c736b94a12f7',
        isSuperAdmin: false,
        isAdmin: false,
        isVolunteer: false,
        firstName: "Brad",
        lastName: "Pipt",
        email: "brad@gmail.com",
        password: "Bp123456",
        mobile: "111-222-333",
      };
  
      const patchData = {
        firstName: "Bradley",
        lastName: "Pitt",
        email: "bradp@gmail.com",
        mobile: "122-233-344",
      };
  
      const post = User.create(dummyUserForUpdate);
      return request(app)
        .patch('/test/99999dc3e954c736b94a12f7')
        .send(patchData)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.body.message).toContain('Zaktualizowano następujące pola');
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