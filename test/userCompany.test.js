const mongoose = require('mongoose');
const { UserCompany } = require('../api/models/userCompany');
const databaseName = 'test';

//you need to connect to a test database while DBCompass is running
beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
});

describe("UserCompany schema tests", () => {
    const user = new UserCompany({
        email: 'firma@gmail.com',
        password: '1Firmaaa',
        nip: '1234567890',
        companyName: 'Firma',
        street: 'Ulica',
        houseNo: '51',
        city: 'Nieznane',
        postcode: '00-000',
        mobile: '123-456-789',
        image: 'image logo company'
    });

    it('Should save user to database with correct data and console.log null if everything is ok', () => {
        user.validate((response) => {
            expect(response).toBe(null);
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