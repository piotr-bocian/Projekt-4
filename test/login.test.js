const bcrypt = require('bcrypt');
const login = require('../api/controllers/login');
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

app.post('/test/login', login.logging);

const dummyUser = {
    _id: "603d60be60915444eb7b7f95",
    isSuperAdmin: false,
    isAdmin: false,
    isVolunteer: false,
    firstName: "Adam",
    lastName: "Adamczyk",
    email: "adam@gmail.com",
    password: 'Aa123456',
    mobile: "123-123-123"
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

// POST LOGIN USER

describe('POST - user logging', () => {
    it('should log user correctly if given email and password are correct, respond with status 200 and send message: Logowanie przebiegło pomyślnie.', async function (done) {
      	let testUser = new User(dummyUser);

	  	const salt = await bcrypt.genSalt(10);
		testUser.password = await bcrypt.hash(testUser.password, salt);
		testUser = await testUser.save();
		
		const loginData = {
			email: "adam@gmail.com",
			password: 'Aa123456'
		};

		const res = await request(app)
		.post('/test/login')
		.send(loginData)
		.set('Accept', 'application/json');
		
		expect(res.status).toBe(200);
		expect(res.body.message).toBe('Logowanie przebiegło pomyślnie.');
		expect(res.body).toHaveProperty('token');
		return done();
    });

	it('should return 400 if given email is invalid', async function (done) {
		const loginData = {
			email: "adamantan@gmail.com",
			password: 'Aa123456'
		};

		const res = await request(app)
		.post('/test/login')
		.send(loginData)
		.set('Accept', 'application/json');

		expect(res.status).toBe(400);
		expect(res.text).toBe('Nieprawidłowy email lub hasło.');
		return done();
  });

  it('should return 400 if given password is invalid', async function (done) {
	const loginData = {
		email: "adam@gmail.com",
		password: 'alaMaKota1'
	};

	const res = await request(app)
	.post('/test/login')
	.send(loginData)
	.set('Accept', 'application/json');

	expect(res.status).toBe(400);
	expect(res.text).toBe('Nieprawidłowy email lub hasło.');
	return done();
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