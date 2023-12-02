/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import crypto from 'crypto';
// import prisma from '../prisma';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteBlockedTokens);
beforeEach(fixtures.deleteEmailVerification);

describe('patch users/password', () => {
    test('update password successfuly', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/password')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                oldPassword: '12345678Aa@',
                newPassword: '123456789mM@',
                confirmPassword: '123456789mM@',
            })
            .expect(200);

        //login with the neww password

        await supertest(app)
            .post('/api/v1/auth/login')
            .send({
                UUID: `${user1.username}`,
                password: '123456789mM@',
            })
            .expect(200);
    });

    test('fail to update password due to wrong old password', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/password')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                oldPassword: '12345678ghH@',
                newPassword: '123456789mM@',
                confirmPassword: '123456789mM@',
            })
            .expect(401);
    });

    test('fail to update password due to mismatch between new password and confirm password', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/password')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                oldPassword: '12345678Aa@',
                newPassword: '123456789mM@',
                confirmPassword: '123456789mM@bb',
            })
            .expect(400);
    });
});

describe('post users/checkPassword', () => {
    test('correct password ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .post('/api/v1/users/checkPassword')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                password: '12345678Aa@',
            })
            .expect(200);
    });

    test('wrong password ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .post('/api/v1/users/checkPassword')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                password: '12345678Ayuyuy@',
            })
            .expect(401);
    });

    test('empty password ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .post('/api/v1/users/checkPassword')
            .set({ Authorization: `Bearer ${token}` })
            .send({})
            .expect(403);
    });
});

describe('patch users/email', () => {
    test('update email successfuly', async () => {
        const user1 = await fixtures.addUserToDB1();
        const encryptedToken = crypto
            .createHash('sha256')
            .update('3341eecd')
            .digest('hex');
        await fixtures.addVerificationToken(
            'nesmaAbdElKader@gmail.com',
            encryptedToken
        );
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/email')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                token: '3341eecd',
                email: 'nesmaAbdElKader@gmail.com',
            })
            .expect(200);

        //login with the neww password

        await supertest(app)
            .post('/api/v1/auth/login')
            .send({
                UUID: 'nesmaAbdElKader@gmail.com',
                password: '12345678Aa@',
            })
            .expect(200);
    });

    test('fail to update email due to wrong token', async () => {
        const user1 = await fixtures.addUserToDB1();
        await fixtures.addVerificationToken(
            'nesmaAbdElKader@gmail.com',
            '3341eecd'
        );
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/email')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                token: '2241eecd',
                email: 'nesmaAbdElKader@gmail.com',
            })
            .expect(401);
    });

    test('fail to update email as no email request verification found', async () => {
        const user1 = await fixtures.addUserToDB1();
        await fixtures.addVerificationToken(
            'nesmaAbdElKader@gmail.com',
            '3341eecd'
        );
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/email')
            .set({ Authorization: `Bearer ${token}` })
            .send({
                token: '3341eecd',
                email: 'nesmaAbdElKader234@gmail.com',
            })
            .expect(404);
    });
});
