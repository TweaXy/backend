/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

describe('FOLLOW/UNFOLLOW', () => {
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
});

describe('GET followers/followings', () => {
    test('successful get list of followers', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addFollow(user2.id, user1.id);
        await fixtures.addFollow(user3.id, user1.id);

        const res = await supertest(app)
            .get(
                '/api/v1/users/followers/' +
                    user1.username +
                    '?limit=2&offset=0'
            )
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
});
