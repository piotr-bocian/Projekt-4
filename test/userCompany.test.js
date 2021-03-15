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

    it('Should throw error if email is not valid email address', () => {
        user.email = 'super_firma@.com';
        user.validate((response) => {
            expect(response.errors.email.message).toBe('Property email should be a valid email');
        });
    });

    it('Should throw error if password does not contain 1 digit, 1 lowercase, 1 uppercase and is less than 8 char long', () => {
        user.password = 'firma';
        user.validate((response) => {
            expect(response.errors.password.message).toBeTruthy();
        });
    });

    it('Should throw error if nip is less or more than 10 characters', () => {
        user.nip = '0123';
        user.validate((response) => {
            expect(response.errors.nip.message).not.toBe(null);
        });
    });

    it('Should throw error if at least one of mentioned properties is invalid', () => {
        user.companyName = '';
        user.street = '';
        user.houseNo = '';
        user.city =  '';
        user.validate((response) => {
            expect(response.errors.companyName.message).not.toBe(null);
            expect(response.errors.street.message).not.toBe(null);
            expect(response.errors.houseNo.message).not.toBe(null);
            expect(response.errors.city.message).not.toBe(null);
        });
    });

    it('Should throw error if postcode is less or more than 6 characters', () => {
        user.postcode = '12-45';
        user.validate((response) => {
            expect(response.errors.nip.message).not.toBe(null);
        });
    });

    it('Should throw error if mobile number does not match the patterns: +12 123-456-789 or 123-456-789', () => {
        user.mobile = '+12 123 456 792';
        user.validate((response) => {
            expect(response.errors.mobile.message).toBe('Property mobile should match a pattern: +12 123-456-789 or 123-456-789');
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