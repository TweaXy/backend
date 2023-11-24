/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import { generateToken } from '../utils/index.js';
import prisma from '../prisma.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
test('login a user', async () => {

    const user1 = await fixtures.addUserToDB();
    await supertest(app).post('/api/v1/auth/login').send({
        UUID: user1.email,
        password: '12345678Aa@'
    }).expect(200);  //user login by email

    await supertest(app).post('/api/v1/auth/login').send({
        UUID: user1.username,
        password: '12345678Aa@'
    }).expect(200); //user login by username


});
test('login failed', async () => {
    const user1 = await fixtures.addUserToDB();
    await supertest(app).post('/api/v1/auth/login').send({
        UUID: user1.email,
        password: '12345678Wa@'
    }).expect(401);   //wrong password


    await supertest(app).post('/api/v1/auth/login').send({
        UUID: '',
        password: '12345678Aa@'
    }).expect(403);   //email is empty 

});


test('logout sucessfully', async () => {
    const user1 = await fixtures.addUserToDB();
    const token = generateToken(user1.id);
    await supertest(app).post('/api/v1/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .expect(200);  //right token

    //token should be add to the blockedTokens
    const blokedToken = await prisma.blockedTokens.findUnique({
        where: {
            token
        },
    });
    expect(blokedToken).not.toBeNull();

    await supertest(app).post('/api/v1/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .expect(401);  //already bloked token
});


test('logout fail since wrong token', async () => {
    const user1 = await fixtures.addUserToDB();
    let wrongId = user1.id;
    wrongId = `${wrongId}11`;
    let token = generateToken(wrongId);
    await supertest(app).post('/api/v1/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .expect(401);  //wrong token
});

test('logout fail since already bloked token', async () => {
    const user1 = await fixtures.addUserToDB();
    const token = generateToken(user1.id);
    await supertest(app).post('/api/v1/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .expect(200);  //right token


    await supertest(app).post('/api/v1/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .expect(401);  //already bloked token
});
