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
beforeEach(fixtures.deleteFollows);
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
        .field('website', 'http://google.com/')
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
    expect(newUser.website).toBe('http://google.com/');
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

    await new Promise((resolve) => setTimeout(resolve, 10));

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

    await new Promise((resolve) => setTimeout(resolve, 10));

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

    await new Promise((resolve) => setTimeout(resolve, 10));

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
test('successful follow', async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    const token = generateToken(user1.id);

    await supertest(app)
        .post('/api/v1/users/follow/' + user2.username)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    const follow = await fixtures.findFollow(user1.id, user2.id);
    expect(follow).not.toBeNull();
});

test('unsuccessful follow when user not fount', async () => {
    const user1 = await fixtures.addUserToDB1();
    const token = generateToken(user1.id);

    await supertest(app)
        .post('/api/v1/users/follow/blabla')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
});

test('unsuccessful follow when already follow', async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    await fixtures.addFollow(user1.id, user2.id);
    const token = generateToken(user1.id);

    await supertest(app)
        .post('/api/v1/users/follow/' + user2.username)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
});

test('successful unfollow', async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    await fixtures.addFollow(user1.id, user2.id);
    const token = generateToken(user1.id);

    await supertest(app)
        .delete('/api/v1/users/follow/' + user2.username)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    const follow = await fixtures.findFollow(user1.id, user2.id);
    expect(follow).toBeNull();
});

test('unsuccessful unfollow when user not found', async () => {
    const user1 = await fixtures.addUserToDB1();
    const token = generateToken(user1.id);

    await supertest(app)
        .delete('/api/v1/users/follow/blabla')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
});

test('unsuccessful unfollow when already unfollowed', async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    const token = generateToken(user1.id);

    await supertest(app)
        .delete('/api/v1/users/follow/' + user2.username)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
});

test('successful get list of followers', async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    const user3 = await fixtures.addUserToDB3();

    await fixtures.addFollow(user2.id, user1.id);
    await fixtures.addFollow(user3.id, user1.id);

    const res = await supertest(app)
        .get('/api/v1/users/followers/' + user1.username + '?limit=2&offset=0')
        .expect(200);

    expect(res.body).toMatchObject({
        data: {
            followers: [
                {
                    name: user2.name,
                    username: user2.username,
                    avatar: user2.avatar,
                    bio: user2.bio,
                },
                {
                    name: user3.name,
                    username: user3.username,
                    avatar: user3.avatar,
                    bio: user3.bio,
                },
            ],
        },
        pagination: {
            itemsNumber: 2,
            nextPage: null,
            prevPage: null,
        },
        status: 'success',
    });
});

test('unsuccessful get list of followers when user is not found', async () => {
    await supertest(app).get('/api/v1/users/followers/blabla').expect(404);
});

test('successful get list of followings', async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    const user3 = await fixtures.addUserToDB3();

    await fixtures.addFollow(user1.id, user2.id);
    await fixtures.addFollow(user1.id, user3.id);

    const res = await supertest(app)
        .get('/api/v1/users/followings/' + user1.username)
        .expect(200);

    expect(res.body).toMatchObject({
        data: {
            followings: [
                {
                    name: user2.name,
                    username: user2.username,
                    avatar: user2.avatar,
                    bio: user2.bio,
                },
                {
                    name: user3.name,
                    username: user3.username,
                    avatar: user3.avatar,
                    bio: user3.bio,
                },
            ],
        },
        pagination: {
            itemsNumber: 2,
            nextPage: null,
            prevPage: null,
        },
        status: 'success',
    });
});

test('unsuccessful get list of followings when user is not found', async () => {
    await supertest(app).get('/api/v1/users/followings/blabla').expect(404);
});
