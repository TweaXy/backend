/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import path from 'path';
import app from '../app';
import dotenv from 'dotenv';
import supertest from 'supertest';
import fixtures from './fixtures/db';


dotenv.config({ path: path.resolve(__dirname, '../../test.env') });
// Setup for each test
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteEmailVerification);


describe('sign in with google tests with error', () => {
    

    test('unsuccessful sign in with google (web) endpoint', async () => {
       

        // eslint-disable-next-line no-unused-vars
        const user1 = await fixtures.addUserToDB1();
        const res = await supertest(app)
            .post('/api/v1/auth/google')
            .send({ token: '12345678' })
            .expect(500);

       
    });
});
