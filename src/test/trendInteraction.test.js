/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import { generateToken } from '../utils/index.js';
import prisma from '../prisma.js';
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
        user1.id,
        tweet1.id,
        'RETWEET'
    );

    const retweet2 = await fixtures.addRetweetCommentToDB(
        user1.id,
        retweet1.id,
        'RETWEET'
    );

    return {
        users: [user1, user2],
        tweets: [tweet1, tweet2, tweet3],
        retweets: [retweet1, retweet2],
        comment: [comment1],
    };
};

describe('Trends Interaction API', () => {
    test('should get interactions in trends', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const token1 = generateToken(user1.id);
        const token2 = generateToken(user2.id);

        const tweet1 = await supertest(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token1}`)
            .send({ text: 'This is my first tweet #cool #amazing' });
        const tweet2 = await supertest(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token1}`)
            .send({ text: 'This is my secpnd tweet #cool #amazing #cool' });

        const response = await supertest(app)
            .get('/api/v1/trends/cool')
            .set('Authorization', `Bearer ${token2}`);

        // Check status code and basic structure
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.data).toHaveProperty('items');
        expect(response.body.data.items).toBeInstanceOf(Array);

        // Check data
        expect(response.body.data.items).toHaveLength(2);
        expect(response.body.data.items[0]).toHaveProperty('mainInteraction');
        expect(response.body.data.items[0].mainInteraction).toHaveProperty(
            'id',
            tweet2.body.data.tweet.id
        );

        expect(response.body.data.items[1].mainInteraction).toHaveProperty(
            'id',
            tweet1.body.data.tweet.id
        );
    });

    test('should handle authentication failure with invalid credentials', async () => {
        await supertest(app)
            .get('/api/v1/trends/wow')
            .query({ limit: 2, offset: 1 })
            .expect(401);
    });
});
