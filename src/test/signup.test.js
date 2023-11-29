/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import crypto from 'crypto';


dotenv.config({ path: path.resolve(__dirname, '../../test.env') });
// Setup for each test
beforeEach(() => {
    fixtures.deleteUsers();
    fixtures.deleteEmailVerification();
});

jest.mock('../utils/sendEmail');

describe('signup tests', () => {
    test('successful sign up', async () => {
        const token = '12345678';
        const encryptedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const email = 'ibrahim.eman83@gmail.com';
        await fixtures.addVerificationToken(email, encryptedToken);

        const res = await supertest(app)
            .post('/api/v1/auth/signup')
            .send({
                email,
                name: 'eman',
                password: 'Eman@2002',
                emailVerificationToken: token,
                birthdayDate: '10-10-2002',
            })
            .expect(200);

        const user = await fixtures.findUserById(res.body.data.user.id);
        expect(user).not.toBeNull();
      
    });

    test('unsuccessful sign up when email verification token is not valid', async () => {
        
        const email = 'ibrahim.eman83@gmail.com';
        const token = '12345678';
        const encryptedToken = crypto
            .createHash('sha256')
            .update('11111111')
            .digest('hex');
        await fixtures.addVerificationToken(email, encryptedToken);

        await supertest(app)
            .post('/api/v1/auth/signup')
            .send({
                email,
                name: 'eman',
                password: 'Eman@2002',
                emailVerificationToken: token,
                birthdayDate: '10-10-2002',
            })
            .expect(401);

        
      
    });

    test('unsuccessful sign up when email is not verified', async () => {
        
        const email = 'ibrahim.eman83@gmail.com';
        const token = '12345678';

        await supertest(app)
            .post('/api/v1/auth/signup')
            .send({
                email,
                name: 'eman',
                password: 'Eman@2002',
                emailVerificationToken: token,
                birthdayDate: '10-10-2002',
            })
            .expect(404);

        
      
    });

    test('unsuccessful sign up when email or username already exists', async () => {
        

        await fixtures. addUserToDB1();
        const email = 'ibrahim.eman83@gmail.com';
        const token = '12345678';
        const encryptedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        await fixtures.addVerificationToken(email, encryptedToken);

        await supertest(app)
            .post('/api/v1/auth/signup')
            .send({
                email,
                name: 'eman',
                password: 'Eman@2002',
                emailVerificationToken: token,
                birthdayDate: '10-10-2002',
            })
            .expect(400);

        
      
    });

});
