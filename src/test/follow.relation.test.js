/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
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

    test('unsuccessful follow when user follows himself', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/follow/' + user1.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
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

    test('unsuccessful follow when user follows a blocking user', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        await fixtures.addBlock(user2.id, user1.id);
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/follow/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });

    test('unsuccessful follow when user follows a blocked user', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        await fixtures.addBlock(user1.id, user2.id);
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/follow/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
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

        const token = generateToken(user1.id);

        await fixtures.addFollow(user2.id, user1.id);
        await fixtures.addFollow(user3.id, user1.id);
        await fixtures.addFollow(user1.id, user2.id);

        const res = await supertest(app)
            .get(
                '/api/v1/users/followers/' +
                    user1.username +
                    '?limit=2&offset=0'
            )
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toEqual(
            expect.objectContaining({
                data: {
                    followers: [
                        {
                            id: user2.id,
                            name: user2.name,
                            username: user2.username,
                            avatar: user2.avatar,
                            bio: user2.bio,
                            followsMe: true,
                            followedByMe: true,
                            blockedByMe: false,
                            blocksMe: false,
                        },
                        {
                            id: user3.id,
                            name: user3.name,
                            username: user3.username,
                            avatar: user3.avatar,
                            bio: user3.bio,
                            followsMe: true,
                            followedByMe: false,
                            blockedByMe: false,
                            blocksMe: false,
                        },
                    ],
                },
                status: 'success',
            })
        );
    });

    test('unsuccessful get list of followers when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        await supertest(app)
            .get('/api/v1/users/followers/blabla')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });

    test('unsuccessful get list of followers when user is blocked', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        await fixtures.addBlock(user2.id, user1.id);
        const token = generateToken(user1.id);
        await supertest(app)
            .get('/api/v1/users/followers/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });

    test('successful get list of followings', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        const token = generateToken(user1.id);

        await fixtures.addFollow(user1.id, user2.id);
        await fixtures.addFollow(user1.id, user3.id);
        await fixtures.addFollow(user2.id, user1.id);

        const res = await supertest(app)
            .get('/api/v1/users/followings/' + user1.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toEqual(
            expect.objectContaining({
                data: {
                    followings: [
                        {
                            id: user2.id,
                            name: user2.name,
                            username: user2.username,
                            avatar: user2.avatar,
                            bio: user2.bio,
                            followsMe: true,
                            followedByMe: true,
                            blockedByMe: false,
                            blocksMe: false,
                        },
                        {
                            id: user3.id,
                            name: user3.name,
                            username: user3.username,
                            avatar: user3.avatar,
                            bio: user3.bio,
                            followsMe: false,
                            followedByMe: true,
                            blockedByMe: false,
                            blocksMe: false,
                        },
                    ],
                },
                status: 'success',
            })
        );
    });

    test('unsuccessful get list of followings when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();

        const token = generateToken(user1.id);

        await supertest(app)
            .get('/api/v1/users/followings/blabla')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });

    test('unsuccessful get list of followings when user is blocked', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        await fixtures.addBlock(user2.id, user1.id);
        const token = generateToken(user1.id);
        await supertest(app)
            .get('/api/v1/users/followings/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });
});
