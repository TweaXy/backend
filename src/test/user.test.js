/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import prisma from '../prisma';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteBlockedTokens);

test('checkUUIDExists if UUID exists', async () => {
    const user1 = await fixtures.addUserToDB2();
    await supertest(app)
        .post('/api/v1/users/checkUUIDExists')
        .send({
            UUID: user1.email,
        })
        .expect(200);

    await supertest(app)
        .post('/api/v1/users/checkUUIDExists')
        .send({
            UUID: user1.phone,
        })
        .expect(200);

    await supertest(app)
        .post('/api/v1/users/checkUUIDExists')
        .send({
            UUID: user1.username,
        })
        .expect(200);
});

test('checkUUIDExists if UUID does not exist', async () => {
    await supertest(app)
        .post('/api/v1/users/checkUUIDExists')
        .send({
            UUID: '01285043189',
        })
        .expect(404);
});

test('checkUsernameUniqueness if username exists', async () => {
    const user1 = await fixtures.addUserToDB2();
    await supertest(app)
        .post('/api/v1/users/checkUsernameUniqueness')
        .send({
            username: user1.username,
        })
        .expect(409);
});

test('checkUsernameUniqueness if username does not exist', async () => {
    await supertest(app)
        .post('/api/v1/users/checkUsernameUniqueness')
        .send({
            username: 'saratytkl',
        })
        .expect(200);
});

test('checkEmailUniqueness if email exists', async () => {
    const user1 = await fixtures.addUserToDB2();
    await supertest(app)
        .post('/api/v1/users/checkEmailUniqueness')
        .send({
            email: user1.email,
        })
        .expect(409);
});

test('checkEmailUniqueness if email does not exist', async () => {
    await supertest(app)
        .post('/api/v1/users/checkEmailUniqueness')
        .send({
            email: 'saral@gmail.com',
        })
        .expect(200);
});

test('check getUserById if Id exists', async () => {
    const user1 = await fixtures.addUserToDB1();
    await supertest(app).get(`/api/v1/users/${user1.id}`).send({}).expect(200);
});

test('check getUserById if Id does not exist', async () => {
    const user1 = await fixtures.addUserToDB1();
    await supertest(app)
        .get(`/api/v1/users/${user1.id}11`)
        .send({})
        .expect(404);
});

test('sucessfully edit profile info', async () => {
    const user1 = await fixtures.addUserToDB1();
    const token = generateToken(user1.id);
    await supertest(app)
        .patch('/api/v1/users/')
        .set({ Authorization: `Bearer ${token}` })
        .field('phone', '01122429262')
        .field('name', 'nesma')
        .field('bio', 'hello world')
        .field('location', 'Cairo')
        .field('birthdayDate', '10-10-2010')
        .field('website', 'http://localhost:5555/')
        .expect(200);

    await new Promise((resolve) => setTimeout(resolve, 10));
    
    const newUser = await prisma.user.findUnique({
        where: {
            id: user1.id,
        },
    });
    expect(newUser.phone).toBe('01122429262');
    expect(newUser.name).toBe('nesma');
    expect(newUser.bio).toBe('hello world');
    expect(newUser.location).toBe('Cairo');
    expect(newUser.website).toBe('http://localhost:5555/');
});

test('fail edit profile info', async () => {
    const user1 = await fixtures.addUserToDB1();
    const token = generateToken(user1.id);
    await supertest(app)
        .patch('/api/v1/users/')
        .set({ Authorization: `Bearer ${token}` })
        .field('name', 'no') ///name < 4 char
        .expect(403);

    await supertest(app)
        .patch('/api/v1/users/')
        .set({ Authorization: `Bearer ${token}` })
        .field('phone', '0112242936') //phone number < 11 digit
        .expect(403);

    await supertest(app)
        .patch('/api/v1/users/')
        .set({ Authorization: `Bearer ${token}` })
        .field('birthdayDate', '10-10-2025') //data > todat
        .expect(403);
});

test('sucessfully edit profile picture ', async () => {
    ///add the avatar then delete it
    const user1 = await fixtures.addUserToDB1();
    const token = generateToken(user1.id);

    await supertest(app)
        .patch('/api/v1/users/')
        .set({ Authorization: `Bearer ${token}` })
        .attach('avatar', 'src/test/fixtures/testImg.jpg')
        .expect(200);

    await new Promise((resolve) => setTimeout(resolve, 10));

    await supertest(app)
        .delete('/api/v1/users/profilePicture')
        .set({ Authorization: `Bearer ${token}` })
        .expect(200);
});

test('sucessfully edit profile Banner ', async () => {
    ///add the cover then delete it
    const user1 = await fixtures.addUserToDB1();
    const token = generateToken(user1.id);
    await supertest(app)
        .patch('/api/v1/users/')
        .set({ Authorization: `Bearer ${token}` })
        .attach('cover', 'src/test/fixtures/testImg2.jpeg')
        .expect(200);

    await new Promise((resolve) => setTimeout(resolve, 10));

    await supertest(app)
        .delete('/api/v1/users/profileBanner')
        .set({ Authorization: `Bearer ${token}` })
        .expect(200);
});
