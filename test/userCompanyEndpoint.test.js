const request = require('supertest');
const userCompanyController = require('../api/controllers/userCompany');
const { UserCompany } = require('../api/models/userCompany');
const express = require('express');
const mongoose = require('mongoose');
const databaseName = 'test';
const { upload } = require('../api/middleware/upload');

// here create endpoint for tests,
const app = express();
app.use(express.json());

app.get('/test', userCompanyController.usersGetAll);
app.get('/test/:id', userCompanyController.userCompanyGetUser);
app.post('/test', upload.single('image'), userCompanyController.userCompanyAddUser);
app.delete('/test/:id', userCompanyController.userCompanyDeleteUser);
app.patch('/test/:id', userCompanyController.userCompanyUpdateUser);


const dummyData = {
    _id: "7199803df3f4948bd2f98113",
    email: "uslugi.kowalski@mail.com",
    password: "TestoweHaslo123",
    nip: "1234567891",
    companyName: "Usługi Kowalski",
    street: "Katowicka",
    houseNo: "11",
    city: "Katowice",
    postcode: "44-100",
    mobile: "123-456-780"
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

  it('should response with status 400 when incorrect id is sending also it should return: Podano błędny numer _id', function (done) {
    return request(app)
      .get('/test/incorectid')
      .set('Accept', 'application/json')
      .expect(400, {message: 'Podano nieprawidłowy numer id'})
      .then((response) => {
        expect(response.body.message).toBe('Podano nieprawidłowy numer id');
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 200 when correct id is sending', function (done) {
    const post = UserCompany.create(dummyData);
    return request(app)
      .get('/test/7199803df3f4948bd2f98113')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual({ //
            _id: "7199803df3f4948bd2f98113",
            email: "uslugi.kowalski@mail.com",
            password: "TestoweHaslo123",
            nip: "1234567891",
            companyName: "Usługi Kowalski",
            street: "Katowicka",
            houseNo: "11",
            city: "Katowice",
            postcode: "44-100",
            mobile: "123-456-780",
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
      .expect(404, {message: 'Użytkownik o podanym ID nie istnieje.'})
      .then((response) => {
        expect(response.body.message).toBe('Użytkownik o podanym ID nie istnieje.');
        done();
      })
      .catch((err) => done(err));
  });
});

// 'POST /test'
describe('POST', () => {
  it('should respond with status 200', function (done) {
    const postData = {
      email: "nowakowscy@mail.com",
      password: "TestoweHaslo123",
      nip: "1234567890",
      companyName: "Meble Nowakowscy",
      street: "Poznańska",
      houseNo: "11",
      city: "Poznań",
      postcode: "33-100",
      mobile: "123-456-789"
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.message).toBe('Rejestracja przebiegła pomyślnie');
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with status 400 when incorrect data are sended, it should also send: \"nip\" length must be 10 characters long', function (done) {
    const postData = {
        email: "nowakowscy@mail.com",
        password: "TestoweHaslo123",
        nip: "123456789",
        companyName: "Meble Nowakowscy",
        street: "Poznańska",
        houseNo: "11",
        city: "Poznań",
        postcode: "33-100",
        mobile: "123-456-789"
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err, res) {
        expect(res.body.message).toBe(
          '\"nip\" length must be 10 characters long'
        );
        if (err) return done(err);
        return done();
      });
  });
  
  it('should respond with status 400 when incorrect data are sended, it should also send: Użytkownik o podanym adresie email jest już zarejestrowany.', function (done) {
    const postData = {
        email: "uslugi.kowalski@mail.com",
        password: "TestoweHaslo123",
        nip: "1234567890",
        companyName: "Usługi Kowalski",
        street: "Poznańska",
        houseNo: "11",
        city: "Poznań",
        postcode: "33-100",
        mobile: "123-456-789"
    };

    request(app)
      .post('/test')
      .send(postData)
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err, res) {
        expect(res.body.message).toBe(
          'Użytkownik o podanym adresie email jest już zarejestrowany.'
        );
        if (err) return done(err);
        return done();
      });
  });
});

// // DELETE /test
describe('DELETE', () => {
  it('should response with status 400 and send: Podano błędny numer _id', function (done) {
    return request(app)
      .delete('/test/incorrectid')
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Podano błędny numer _id');
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 404 and send: Użytkownik o podanym ID nie istnieje.', function (done) {
    const dummyDataDelete = {
        _id: '60369dc3e954c736b94a12f5',
        email: "nowakowscy2@mail.com",
        password: "TestoweHaslo123",
        nip: "1234567890",
        companyName: "Meble Nowakowscy Dwa",
        street: "Poznańska",
        houseNo: "11",
        city: "Poznań",
        postcode: "33-100",
        mobile: "123-456-789"
    };
    const post = UserCompany.create(dummyDataDelete);
    return request(app)
      .delete('/test/60369dc3e954c736b94a12f0')
      .set('Accept', 'application/json')
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Użytkownik o podanym ID nie istnieje.');
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 202 and send: Użytkownik został poprawnie usunięty', function (done) {
    const dummyDataDelete = {
        _id: '99369dc3e954c736b94a12f5',
        email: "nowakowscy3@mail.com",
        password: "TestoweHaslo123",
        nip: "1234567890",
        companyName: "Meble Nowakowscy Trzy",
        street: "Poznańska",
        houseNo: "11",
        city: "Poznań",
        postcode: "33-100",
        mobile: "123-456-789"
    };
    const post = UserCompany.create(dummyDataDelete);
    return request(app)
      .delete('/test/99369dc3e954c736b94a12f5')
      .set('Accept', 'application/json')
      .expect(202)
      .then((response) => {
        expect(response.body.message).toBe(
          'Użytkownik został poprawnie usunięty'
        );
        done();
      })
      .catch((err) => done(err));
  });
});

// PATCH /test
describe('PATCH', () => {
    it('should response with status 200 and send message: Zaktualizowano nastepujące pola {\"city\":\"Katowice\"}', function (done) {
      const dummyDataForPatch = {
        _id: '77777dc3e954c736b94a12f5',
        email: "nowakowscy4@mail.com",
        password: "TestoweHaslo123",
        nip: "1234567890",
        companyName: "Meble Nowakowscy Cztery",
        street: "Poznańska",
        houseNo: "11",
        city: "Poznań",
        postcode: "33-100",
        mobile: "123-456-789"
      };
  
      const patchData = {"city": "Katowice"};
  
      const post = UserCompany.create(dummyDataForPatch);
      return request(app)
        .patch('/test/77777dc3e954c736b94a12f5')
        .send(patchData)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe(
            'Zaktualizowano nastepujące pola {\"city\":\"Katowice\"}'
          );
          done();
        })
        .catch((err) => done(err));
    });
    it('should response with status 400 and send message: \"nip\" length must be 10 characters long', function (done) {
      const dummyDataForPatch = {
        _id: '10000dc3e954c736b94a12f5',
        email: "nowakowscy5@mail.com",
        password: "TestoweHaslo123",
        nip: "1234567890",
        companyName: "Meble Nowakowscy Pięć",
        street: "Poznańska",
        houseNo: "11",
        city: "Poznań",
        postcode: "33-100",
        mobile: "123-456-789"
      };
  
      const patchData = {'nip':"123456789" };
  
      const post = UserCompany.create(dummyDataForPatch);
      return request(app)
        .patch('/test/10000dc3e954c736b94a12f5')
        .send(patchData)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe(
            '\"nip\" length must be 10 characters long'
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