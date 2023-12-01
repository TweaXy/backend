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
beforeEach(fixtures.deleteFollows);

describe('search tests', () => {
    test('successful search', async () => {
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
});
