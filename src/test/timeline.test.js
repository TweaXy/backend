/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import { generateToken } from '../utils/index.js';
dotenv.config({ path: path.resolve(__dirname, '../../test.env') });

beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteInteractions);

const createUserAndTweets = async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();

    const tweet1 = await fixtures.addTweetToDB(user1.id);
    const tweet2 = await fixtures.addTweetToDB(user1.id);
    const tweet3 = await fixtures.addTweetToDB(user1.id);

    const retweet1 = await fixtures.addRetweetCommentToDB(
        user2.id,
        tweet1.id,
        'RETWEET'
    );

    const retweet2 = await fixtures.addRetweetCommentToDB(
        user2.id,
        retweet1.id,
        'RETWEET'
    );

    const comment1 = await fixtures.addRetweetCommentToDB(
        user2.id,
        tweet1.id,
        'COMMENT'
    );

    return {
        users: [user1, user2],
        tweets: [tweet1, tweet2, tweet3],
        retweets: [retweet1, retweet2],
        comment: [comment1],
    };
};

describe('Timeline API', () => {
    test('should get timeline', async () => {
        const { users, tweets, retweets, comments } =
            await createUserAndTweets();

        await fixtures.likeInteraction(users[0].id, tweets[2].id);
        // order of ranking tweet1, retweet1, tweet3, tweet2

        // user2 follows user1
        await fixtures.followUser(users[1].id, users[0].id);

        // user3 like interaction

        const token2 = await generateToken(users[1].id);
        const response = await supertest(app)
            .get('/api/v1/home')
            .query({ limit: 2, offset: 1 })
            .set('Authorization', `Bearer ${token2}`);

        // Check status code and basic structure
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.data).toHaveProperty('items');
        expect(response.body.data.items).toBeInstanceOf(Array);

        // Check pagination properties
        expect(response.body.pagination).toHaveProperty('totalCount');
        expect(response.body.pagination).toHaveProperty('itemsCount');
        expect(response.body.pagination).toHaveProperty('nextPage');
        expect(response.body.pagination).toHaveProperty('prevPage');

        // Additional checks on the content of the response
        const { data, pagination } = response.body;
        const { items } = data;

        expect(pagination.itemsCount).toBe(2);
        expect(pagination.totalCount).toBe(5);
        expect(pagination.nextPage).toContain('limit=2&offset=3');
        expect(pagination.prevPage).toContain('limit=2&offset=0');

        expect(items.length).toBe(2);

        expect(items[0].mainInteraction).toHaveProperty('id', retweets[0].id);
        expect(items[0].parentInteraction).toHaveProperty('id', tweets[0].id);
        expect(items[1].mainInteraction).toHaveProperty('id', tweets[2].id);
        expect(items[1].parentInteraction).toBeNull();
    });

    test('should handle authentication failure with invalid credentials', async () => {
        await supertest(app)
            .get('/api/v1/home')
            .query({ limit: 2, offset: 1 })
            .expect(401);
    });
});
