const mongoose = require('mongoose');
const { User } = require('../api/models/user');
const jwt = require('jsonwebtoken');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
});

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            email: 'bch@gmail.com',
            isAdmin: true,
            isSuperAdmin: false,
            isVolunteer: false
        };
        const user = new User(payload);
        console.log('user',user);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, process.env.SCHRONISKO_JWT_PRIVATE_KEY);
        console.log('decoded',decoded)
        expect(decoded).toMatchObject(payload);
    });
});

describe("User schema tests", () => {
    const user = new User({
        firstName: 'Karol',
        lastName: 'Kowalski',
        email: 'k.kowalski@gmail.com',
        password: 'Kkowals1',
        mobile: '123-456-789',
        image: 'fantastic image of my dog',
        isAdmin: true,
        isVolunteer: false
    });

    it('Should save user to database with correct data and console.log null if everything is ok', () => {
        user.validate((response) => {
            expect(response).toBe(null);
        });
    });

    it('Should throw error if firstName and / or lastName property is invalid', () => {
        user.firstName = 'a';
        user.lastName = 'X';
        user.validate((response) => {
            expect(response.errors.firstName.message).toBe('Path `firstName` (`a`) is shorter than the minimum allowed length (2).');
            expect(response.errors.lastName.message).toBe('Path `lastName` (`X`) is shorter than the minimum allowed length (2).');
        });
    });

    it('Should throw error if password does not contain 1 digit, 1 lowercase, 1 uppercase and is less than 8 char long', () => {
        user.password = 'kowal';
        user.validate((response) => {
            expect(response.errors.password.message).toBeTruthy();
        });
    });

    it('Should throw error if email is not valid email address', () => {
        user.email = 'k.kowalskigmail.com';
        user.validate((response) => {
            expect(response.errors.email.message).toBeTruthy();
        });
    });

    it('Should throw error if mobile number does not match the patterns: +12 123-456-789 or 123-456-789', () => {
        user.mobile = '+12 123 456 789';
        user.validate((response) => {
            expect(response.errors.mobile.message).toBeTruthy();
        });
    });

});

//you have to clean the collections after the test
async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for(const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

afterEach(async () => {
    await removeAllCollections();
});
//and close connection to data base
afterAll((done) => {
    mongoose.connection.close();
    done();
});