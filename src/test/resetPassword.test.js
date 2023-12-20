/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import prisma from '../prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

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

const checkResetToken = async (email, token, expectedStatusCode) => {
    return supertest(app)
        .get(`/api/v1/auth/checkResetToken/${email}/${token}`)
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

        const userDB = await prisma.user.findFirst();
        const isEqualPassword = await bcrypt.compare(
            newPassword,
            userDB.password
        );

        // check that the password has been changed
        expect(isEqualPassword).toBe(true);
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

    test('reset password with not valid password', async () => {
        const user1 = await fixtures.addUserToDB1();
        await addResetPasswordToDB(user1.id);

        // reset with not valid password
        await supertest(app)
            .post(`/api/v1/auth/resetPassword/${user1.email}/${resetToken}`)
            .send({ password: '123456' })
            .expect(403);
    });

    test('reset password with not valid password', async () => {
        const user1 = await fixtures.addUserToDB1();
        await addResetPasswordToDB(user1.id);

        // reset password with not valid passwordnot valid password
        await supertest(app)
            .post(`/api/v1/auth/resetPassword/${user1.email}/12345`)
            .send({ password: newPassword })
            .expect(403);
    });

    test('reset password with fake reset token', async () => {
        const user1 = await fixtures.addUserToDB1();
        await addResetPasswordToDB(user1.id);

        // reset password with fake reset token
        await supertest(app)
            .post(`/api/v1/auth/resetPassword/${user1.email}/1234567A`)
            .send({ password: newPassword })
            .expect(401);
    });
});

describe('check Reset token', () => {
    test('check reset token successfully ', async () => {
        const user1 = await fixtures.addUserToDB1();

        await addResetPasswordToDB(user1.id);

        // send forget password using email
        await checkResetToken(user1.email, resetToken, 200);
        //expect(response.statusCode).toHave();
    });

    test('check reset token invalid token ', async () => {
        const user1 = await fixtures.addUserToDB1();

        await addResetPasswordToDB(user1.id);

        // send forget password using email
        const response = await checkResetToken(user1.email, '12345679', 401);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'Reset Code is invalid'
        );
    });

    test('check reset token expired token ', async () => {
        const user1 = await fixtures.addUserToDB1();

        await addResetPasswordToDB(
            user1.id,
            new Date(Date.now() - resetBeforeMilliSeconds)
        );

        // send forget password using email
        const response = await checkResetToken(user1.email, resetToken, 401);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'Reset Code is expired'
        );
    });

    test('check reset token with wrong validation on token', async () => {
        await checkResetToken('a@a.com', '123456', 403);
    });

    test('check reset token with wrong validation on email', async () => {
        await checkResetToken('aaaa', resetToken, 403);
    });

    test('check reset token with wrong validation on email', async () => {
        await checkResetToken('aliaagheis@gmail.com', resetToken, 404);
    });
});
