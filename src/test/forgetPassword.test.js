/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import prisma from '../prisma';

dotenv.config({ path: path.resolve(__dirname, '../../test.env') });

beforeEach(fixtures.deleteUsers);
jest.mock('../utils/sendEmail');

const resendAfterSeconds = process.env.RESEND_AFTER_SECONDS * 1000;

const forgetPassword = async (UUID, expectedStatusCode) => {
    return supertest(app)
        .post('/api/v1/auth/forgetPassword')
        .send({ UUID })
        .expect(expectedStatusCode);
};

describe('Forget Password', () => {
    test('forget password using different UUID', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();
        // send forget password using email
        await forgetPassword(user1.email, 200);

        // send forget password using username
        await forgetPassword(user2.username, 200);

        // send forget password using phone
        await forgetPassword(user3.phone, 200);
    });

    test('resend forget password', async () => {
        const user1 = await fixtures.addUserToDB1();

        // send forget password using email
        await prisma.user.update({
            where: {
                id: user1.id,
            },
            data: {
                ResetToken: '123456',
                ResetTokenCreatedAt: new Date(Date.now() - resendAfterSeconds),
            },
        });

        // resend forget password using email without waiting
        await forgetPassword(user1.email, 200);
    });

    test('fail resend forget password', async () => {
        const user1 = await fixtures.addUserToDB1();

        // send forget password using email
        await forgetPassword(user1.email, 200);

        // resend forget password using email without waiting
        await forgetPassword(user1.email, 429);
    });

    test('fail forget password', async () => {
        // validation failed
        await forgetPassword('aa', 403);

        // user not in database
        await forgetPassword('a@a.com', 404);
    });
});
