const request = require('supertest');
const postController = require('../api/controllers/postController');
const { Post } = require('../api/models/post');
const express = require('express');
const mongoose = require('mongoose');
const { response } = require('express');
const { func } = require('joi');
const databaseName = 'test';

const app = express();
app.use(express.json());
app.get('/test', postController.postFormsGetAll);
app.get('/test/:postId', postController.postFormGetOne);
app.post('/test', postController.addpostForm);
app.patch('/test/:postId', postController.editpostForm);
app.delete('/test/:postId', postController.deletepostForm);

const data1 = {
  _id: '60377c92f773614138a582d6',
  postDate: '2010-01-12',
  content:
    'Cudny pies shih tzu - Adoptowany 2 miesiące temu z naszego schroniska',
  photo:
    'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
};

const data2 = {
  _id: '6037e7fb89718601ac3a0bf7',
  postDate: '2021-02-22',
  content:
    'Piękny pies shih tzu - Adoptowany 2 miesiące temu z naszego schroniska',
  photo:
    'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
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

// GET
describe('GET', () => {
  it('should return all post forms', function (done) {
    const postForm = Post.create(data1);
    return request(app)
      .get('/test')
      .set('Accept', 'appliacation/json')
      .expect(200)
      .then((response) => {
        expect(response.body.posts.results).toStrictEqual([
          {
            _id: '60377c92f773614138a582d6',
            postDate: '2010-01-12T00:00:00.000Z',
            content:
              'Cudny pies shih tzu - Adoptowany 2 miesiące temu z naszego schroniska',
            photo:
              'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
            __v: 0,
          },
        ]);
        done();
      })
      .catch((err) => done(err));
  });

  it('should return one form when valid id is given', function (done) {
    const postForm = Post.create(data2);
    return request(app)
      .get('/test/6037e7fb89718601ac3a0bf7')
      .set('Accept', 'appliacation/json')
      .expect(200)
      .then((response) => {
        expect(response.body.post).toStrictEqual({
          _id: '6037e7fb89718601ac3a0bf7',
          postDate: '2021-02-22T00:00:00.000Z',
          content:
            'Piękny pies shih tzu - Adoptowany 2 miesiące temu z naszego schroniska',
          photo:
            'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
          __v: 0,
        });
        done();
      })
      .catch((err) => done(err));
  });

  it('should response with status 400 when incorrect id is sending also it should return: Podano błędny numer postId', function (done) {
    return request(app)
      .get('/test/incorectid')
      .set('Accept', 'application/json')
      .expect(400, 'Podano błędny numer _postId')
      .then((response) => {
        expect(response.text).toBe('Podano błędny numer _postId');
        done();
      })
      .catch((err) => done(err));
  });
});

//POST
describe('POST', () => {
  it('should respond with status 201', function (done) {
    const newForm = {
      postDate: '2022-09-31T00:00:00.000Z',
      content:
        'Adoptowany pies 2 miesiące temu z naszego schroniska. Jak widać ma sie dobrze :)',
      photo:
        'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
    };

    request(app)
      .post('/test')
      .send(newForm)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (error, response) {
        expect(response.body.message).toBe('Formularz zostal zapisany');
        if (error) return done(error);
        return done();
      });
  });
});

// describe('PUT', () => {
//   it('should response with status 200 and send: Zaktualizowano nastepujące pola {"mobile":"125-152-144"}', function(done){
//     const patchDummy = {
//       postId: '6037e7fb89718601ac3a0bf0',
//       firstName: 'Krzysztof',
//       lastName: 'Rutkowski',
//       birthDate: '1960-04-06',
//       mobile: '111-222-333',
//       occupation: 'detektyw',
//       preferredTasks: 'praca z psami'
//     }
//     const form = Post.create(patchDummy);

//     const patchData = [{propertyName: 'mobile', newValue: '125-152-144'}];

//     return request(app)
//       .patch('/test/6037e7fb89718601ac3a0bf0')
//       .send(patchData)
//       .set('Accept', 'application/json')
//       .expect(200)
//       .then((response) => {
//         expect(response.body.message).toBe(
//           'Zaktualizowano nastepujące pola {"mobile":"125-152-144"}'
//         );
//         done();
//       })
//       .catch((error) => done(error));
//   });

//   it('should response with status 400 and send: "preferredTasks" must be one of [praca z psami, praca z kotami, promocja schroniska]', function (done){
//     const patchDummy = {
//       postId: '6037e7fb89718601ac3a0bf5',
//       firstName: 'Krzysztof',
//       lastName: 'Rutkowski',
//       birthDate: '1960-04-06',
//       mobile: '111-222-333',
//       occupation: 'detektyw',
//       preferredTasks: 'praca z psami'
//     }
//     const form = VolunteerForm.create(patchDummy);

//     const patchData = [{propertyName: 'preferredTasks', newValue: 'praca z orangutanami'}];

//     return request(app)
//       .patch('/test/6037e7fb89718601ac3a0bf5')
//       .send(patchData)
//       .set('Accept', 'application/json')
//       .expect(400)
//       .then((response) => {
//         expect(response.text).toBe(
//           '"preferredTasks" must be one of [praca z psami, praca z kotami, promocja schroniska]'
//         );
//         done();
//       })
//       .catch((error) => done(error));
//   });
// })

// DELETE
describe('DELETE', () => {
  it('should respond with status 202 and send: Formularz zostal poprawnie usuniety z bazy danych', function (done) {
    const deleteDummy = {
      _id: '6037e7fb89718601ac3a0bf1',
      postDate: '2022-09-31',
      content:
        'Adoptowany pies 2 miesiące temu z naszego schroniska. Jak widać ma sie dobrze :)',
      photo:
        'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
    };
    const form = Post.create(deleteDummy);

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

  it('should respond with status 404 and send: Taki formularz nie figuruje w naszej bazie danych', function (done) {
    const deleteDummy = {
      _id: '6037e7fb89718601ac3a0bf2',
      postDate: '2022-09-31',
      content:
        'Adoptowany pies 2 miesiące temu z naszego schroniska. Jak widać ma sie dobrze :)',
      photo:
        'http://cytrynowelove.pl/wp-content/uploads/2019/09/shih-tzu_usposobienie.jpg',
    };
    const form = Post.create(deleteDummy);

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
