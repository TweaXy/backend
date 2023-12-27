/* eslint-disable no-undef */
import path from 'path';
import app from '../app';
import dotenv from 'dotenv';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import getProfileInfo from '../utils/getProfileInfo';
import getFirebaseProfile from '../utils/getFirebaseProfile';

dotenv.config({ path: path.resolve(__dirname, '../../test.env') });
// Setup for each test
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteEmailVerification);
jest.mock('../utils/getProfileInfo');
jest.mock('../utils/getFirebaseProfile');

describe('sign in with google tests', () => {
    test('successful sign in with google (android) endpoint', async () => {
        getFirebaseProfile.mockReturnValue({
            email: 'ibrahim.Eman83@gmail.com',
        });

        const user1 = await fixtures.addUserToDB1();
        const res = await supertest(app)
            .post('/api/v1/auth/google/android')
            .send({ token: '12345678' })
            .expect(200);

        expect(res.body.data.user).not.toBeNull();
        expect(res.body.data.token).not.toBeNull();
    });

    test('successful sign in with google (web) endpoint', async () => {
        getProfileInfo.mockReturnValue({
            email: 'ibrahim.Eman83@gmail.com',
        });

        const user1 = await fixtures.addUserToDB1();
        const res = await supertest(app)
            .post('/api/v1/auth/google')
            .send({ token: '12345678' })
            .expect(200);

        expect(res.body.data.user).not.toBeNull();
        expect(res.body.data.token).not.toBeNull();
    });
});
