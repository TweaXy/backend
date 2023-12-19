/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import prisma from '../prisma';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(__dirname, '../../test.env') });
// Setup for each test
beforeEach(() => {
    fixtures.deleteUsers();
    fixtures.deleteEmailVerification();
});

jest.mock('../utils/sendEmail');

const resendAfterSeconds = process.env.RESEND_AFTER_SECONDS * 1000;
const tokenExpiryThreshold =
    process.env.VERIFICATION_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000;
const email = 'a@a.com';
const token = '12345678';
const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

const sendEmailVerification = async (email, expectedStatusCode) => {
    return supertest(app)
        .post('/api/v1/auth/sendEmailVerification')
        .send({ email })
        .expect(expectedStatusCode);
};

const checkEmailVerification = async (email, token, expectedStatusCode) => {
    return await supertest(app)
        .get(`/api/v1/auth/checkEmailVerification/${email}/${token}`)
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

describe('Check Email Verification', () => {
    test('check email verification', async () => {
        await fixtures.addVerificationToken(email, encryptedToken);
        // check email verification
        await checkEmailVerification(email, token, 200);
    });

    test('check email verification invalid token', async () => {
        await fixtures.addVerificationToken(email, encryptedToken);
        const response = await checkEmailVerification(email, '12345679', 401);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'Email Verification Code is invalid'
        );
    });

    test('check email verification expired token', async () => {
        await fixtures.addVerificationToken(
            email,
            encryptedToken,
            Date.now() - tokenExpiryThreshold
        );
        const response = await checkEmailVerification(email, '12345678', 401);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'Email Verification Code is expired'
        );
    });

    test('check email verification with wrong validation on token', async () => {
        await checkEmailVerification(email, '123456', 403);
    });

    test('check email verification with wrong validation on email', async () => {
        await checkEmailVerification('aaaa', '123456', 403);
    });

    test('check email verification with wrong url', async () => {
        await supertest(app)
            .get(`/api/v1/auth/checkEmailVerification/${email}`)
            .expect(404);
    });
    test('check email verification not found', async () => {
        await checkEmailVerification(email, token, 404);
    });
});
