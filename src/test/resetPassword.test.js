/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import prisma from '../prisma';
import crypto from 'crypto';
dotenv.config({ path: path.resolve(__dirname, '../../test.env') });

beforeEach(fixtures.deleteUsers);

const resetBeforeMilliSeconds =
    process.env.REST_PASS_EXPIRES_IN_HOURS * 60 * 60 * 1000;

const newPassword = '12345678tT@';
const resetToken = '12345678';
const encryptedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

const resetPassword = async (UUID, expectedStatusCode) => {
    return supertest(app)
        .post(`/api/v1/auth/resetPassword/${UUID}/${resetToken}`)
        .send({ password: newPassword })
        .expect(expectedStatusCode);
};

const addResetPasswordToDB = async (userId, date = new Date()) => {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            ResetToken: encryptedToken,
            ResetTokenCreatedAt: date,
        },
    });
};

describe('Reset Password', () => {
    test('reset password using different UUID', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await addResetPasswordToDB(user1.id);
        await addResetPasswordToDB(user2.id);
        await addResetPasswordToDB(user3.id);

        // send forget password using email
        await resetPassword(user1.email, 200);

        // send forget password using username
        await resetPassword(user2.username, 200);

        // send forget password using phone
        await resetPassword(user3.phone, 200);
    });

    test('reset password actual change password', async () => {
        const user1 = await fixtures.addUserToDB1();
        await addResetPasswordToDB(user1.id);

        // send forget password using email
        await resetPassword(user1.email, 200);

        // login by new password
        supertest(app)
            .post('/api/v1/auth/login')
            .set({ UUID: user1.email, password: newPassword })
            .expect(200);
    });

    test('reset password after become expired', async () => {
        const user1 = await fixtures.addUserToDB1();

        // add reset password before resend after time
        await addResetPasswordToDB(
            user1.id,
            new Date(Date.now() - resetBeforeMilliSeconds)
        );

        // resend reset password using email without waiting
        await resetPassword(user1.email, 401);
    });

    test('reset password with unexist user', async () => {
        // reset password with wrong email
        await resetPassword('a@a.com', 404);
    });

    test('reset password with wrong parameters', async () => {
        const user1 = await fixtures.addUserToDB1();
        await addResetPasswordToDB(user1.id);

        // reset with not valid password
        await supertest(app)
            .post(`/api/v1/auth/resetPassword/${user1.email}/${resetToken}`)
            .send({ password: '123456' })
            .expect(403);

        // reset password with not valid reset token
        await supertest(app)
            .post(`/api/v1/auth/resetPassword/${user1.email}/12345`)
            .send({ password: newPassword })
            .expect(403);

        // reset password with fake reset token
        await supertest(app)
            .post(`/api/v1/auth/resetPassword/${user1.email}/1234567A`)
            .send({ password: newPassword })
            .expect(401);
    });
});
