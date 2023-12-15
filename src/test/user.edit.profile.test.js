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

describe('PATCH users', () => {
    test('sucessfully edit profile info', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/')
            .set({ Authorization: `Bearer ${token}` })
            .field('phone', '01199929262')
            .field('name', 'nesma')
            .field('bio', 'hello world')
            .field('location', 'Cairo')
            .field('birthdayDate', '10-10-2010')
            .field('website', 'http://google.com')
            .expect(200);

        const newUser = await prisma.user.findUnique({
            where: {
                id: user1.id,
            },
        });
        expect(newUser.phone).toBe('01199929262');
        expect(newUser.name).toBe('nesma');
        expect(newUser.bio).toBe('hello world');
        expect(newUser.location).toBe('Cairo');
        expect(newUser.website).toBe('http://google.com');
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

    test('sucessfully edit then delete profile picture ', async () => {
        ///add the avatar then delete it
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);

        await supertest(app)
            .patch('/api/v1/users/')
            .set({ Authorization: `Bearer ${token}` })
            .attach('avatar', 'src/test/fixtures/testImg.jpg')
            .expect(200);

        await supertest(app)
            .delete('/api/v1/users/profilePicture')
            .set({ Authorization: `Bearer ${token}` })
            .expect(200);
    });

    test('fail delete profile picture ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/profilePicture')
            .set({ Authorization: `Bearer ${token}` })
            .expect(409);
    });

    test('sucessfully edit then delete profile Banner ', async () => {
        ///add the cover then delete it
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/')
            .set({ Authorization: `Bearer ${token}` })
            .attach('cover', 'src/test/fixtures/testImg2.jpeg')
            .expect(200);

        await supertest(app)
            .delete('/api/v1/users/profileBanner')
            .set({ Authorization: `Bearer ${token}` })
            .expect(200);
    });

    test('fail delete profile Banner ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .delete('/api/v1/users/profileBanner')
            .set({ Authorization: `Bearer ${token}` })
            .expect(409);
    });

    test('sucessfully edit username', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/updateUserName')
            .set({ Authorization: `Bearer ${token}` })
            .send({ username: 'helal' })
            .expect(200);

        const newUser = await prisma.user.findUnique({
            where: {
                id: user1.id,
            },
        });
        expect(newUser.username).toBe('helal');
    });

    test('fail edit username', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const token = generateToken(user1.id);
        await supertest(app)
            .patch('/api/v1/users/updateUserName')
            .send({ username: user2.username })
            .set({ Authorization: `Bearer ${token}` })
            .expect(409);
    });
});
