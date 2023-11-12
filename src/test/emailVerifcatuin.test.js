/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';

dotenv.config({ path: path.resolve(__dirname, '../../test.env') });

beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteEmailVerification);

const resendAfterSeconds = process.env.RESEND_AFTER_SECONDS * 1000;

const sendEmailVerification = async (email, expectedStatusCode) => {
    return supertest(app)
        .post('/api/v1/auth/sendEmailVerification')
        .send({ email })
        .expect(expectedStatusCode);
};

describe('Email Verification', () => {
    test('send/resend email verification', async () => {
        // send email verification
        await sendEmailVerification('aliaagheis@gmail.com', 200);

        // Delay for 30 seconds before attempting to resend email verification
        await new Promise((resolve) => setTimeout(resolve, resendAfterSeconds));

        // resend email verification
        await sendEmailVerification('aliaagheis@gmail.com', 200);
    }, 1000000);

    test('fail resend email verification', async () => {
        await sendEmailVerification('aliaagheis@gmail.com', 200);

        // More than one request in less than 30 seconds
        await sendEmailVerification('aliaagheis@gmail.com', 429);
    });

    test('fail send email verification', async () => {
        const user1 = await fixtures.addUserToDB1();

        // user already in database
        await sendEmailVerification(user1.email, 400);

        // invalid email
        await sendEmailVerification('a.com', 403);

        // invalid email
        await sendEmailVerification('', 403);
    });
});
