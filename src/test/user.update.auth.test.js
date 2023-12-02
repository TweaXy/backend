/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
// import prisma from '../prisma';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteBlockedTokens);

describe.only('patch users/password', () => {
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
