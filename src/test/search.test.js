/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import { generateToken } from '../utils/index.js';

dotenv.config({ path: path.resolve(__dirname, '../../test.env') });
// Setup for each test
beforeEach(fixtures.deleteUsers);


describe('Search Tests', () => {
    test('successful user search', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        // eslint-disable-next-line no-unused-vars
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addFollow(user1.id, user2.id);

        const token = generateToken(user1.id);
        const res = await supertest(app)
            .get('/api/v1/users/search/sara')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).toEqual(
            expect.objectContaining({
                data: {
                    users: [
                        {
                            id: user1.id,
                            name: user1.name,
                            username: user1.username,
                            avatar: user1.avatar,
                            bio: user1.bio,
                            followsMe: false,
                            followedByMe: false,
                        },
                        {
                            id: user2.id,
                            name: user2.name,
                            username: user2.username,
                            avatar: user2.avatar,
                            bio: user2.bio,
                            followsMe: false,
                            followedByMe: true,
                        },
                    ],
                },
                status: 'success',
            })
        );
    });

    test('successful tweet search', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addtweet(user1.id, 'aloooo');
        await fixtures.addtweet(user1.id, 'hello , i hate college');
        await fixtures.addtweet(user2.id, 'hello from the other world');
        await fixtures.addtweet(user3.id, 'i want to GRADUATEEE');
        await fixtures.addtweet(user3.id, 'i want to eat');

        const token = generateToken(user1.id);

        const res = await supertest(app)
            .get('/api/v1/tweets/search/hello')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.data.items[0].mainInteraction.text).toEqual('hello from the other world');
        expect(res.body.data.items[1].mainInteraction.text).toEqual('hello , i hate college');
        expect(res.body.pagination.totalCount).toEqual(2);
    });

    test('successful tweet search in a specific user profile', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addtweet(user1.id, 'aloooo');
        await fixtures.addtweet(user1.id, 'hello , i hate college');
        await fixtures.addtweet(user2.id, 'hello from the other world');
        await fixtures.addtweet(user3.id, 'i want to GRADUATEEE');
        await fixtures.addtweet(user3.id, 'i want to eat');

        const token = generateToken(user1.id);

        const res = await supertest(app)
            .get(`/api/v1/tweets/search/want?username=${user3.username}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body.data.items[0].mainInteraction.user.id).toEqual(user3.id);
        expect(res.body.data.items[0].mainInteraction.text).toEqual('i want to eat');
        expect(res.body.data.items[1].mainInteraction.user.id).toEqual(user3.id);
        expect(res.body.data.items[1].mainInteraction.text).toEqual('i want to GRADUATEEE');
        expect(res.body.pagination.totalCount).toEqual(2);
    });

    test('unsuccessful tweet search in a specific user profile when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addtweet(user1.id, 'aloooo');
        await fixtures.addtweet(user1.id, 'hello , i hate college');
        await fixtures.addtweet(user2.id, 'hello from the other world');
        await fixtures.addtweet(user3.id, 'i want to GRADUATEEE');
        await fixtures.addtweet(user3.id, 'i want to eat');

        const token = generateToken(user1.id);

        // eslint-disable-next-line no-unused-vars
        const res = await supertest(app)
            .get('/api/v1/tweets/search/want?username=jgcmhcmsxedzu')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);

      
    });
});
