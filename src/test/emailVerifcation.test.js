/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import prisma from '../prisma';

dotenv.config({ path: path.resolve(__dirname, '../../test.env') });
// Setup for each test
beforeEach(() => {
    fixtures.deleteUsers();
    fixtures.deleteEmailVerification();
});

jest.mock('../utils/sendEmail');

const resendAfterSeconds = process.env.RESEND_AFTER_SECONDS * 1000;

const sendEmailVerification = async (email, expectedStatusCode) => {
    return supertest(app)
        .post('/api/v1/auth/sendEmailVerification')
        .send({ email })
        .expect(expectedStatusCode);
};

describe('Email Verification', () => {
    test('send email verification', async () => {
        // send email verification
        await sendEmailVerification('aliaagheis@gmail.com', 200);
    });

    test('resend email verification', async () => {
        // create email verification wit h date before reset seconds
        await prisma.emailVerificationToken.create({
            data: {
                email: 'aliaagheis@gmail.com',
                lastUpdatedAt: new Date(Date.now() - resendAfterSeconds),
                token: '123456',
            },
        });

        // resend email verification
        await sendEmailVerification('aliaagheis@gmail.com', 200);
    });

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
