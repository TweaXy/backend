/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import { generateToken } from '../utils/index.js';
import exp from 'constants';
dotenv.config({ path: path.resolve(__dirname, '../../test.env') });

beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteInteractions);

const createUserAndTrends = async () => {
    const user1 = await fixtures.addUserToDB1();

    const tweet1 = await fixtures.addTweetToDB(user1.id);
    const tweet2 = await fixtures.addTweetToDB(user1.id);
    const tweet3 = await fixtures.addTweetToDB(user1.id);
    const retweet1 = await fixtures.addRetweetCommentToDB(
        user1.id,
        tweet1.id,
        'RETWEET'
    );

    const trend1 = await fixtures.addTrendToDB('trend1', tweet1.id);
    const trend4 = await fixtures.addTrendToDB('trend1', retweet1.id);
    const trend6 = await fixtures.addTrendToDB('trend1', tweet3.id);
    const trend2 = await fixtures.addTrendToDB('trend2', tweet2.id);
    const trend5 = await fixtures.addTrendToDB('trend2', tweet1.id);
    const trend3 = await fixtures.addTrendToDB('trend3', tweet3.id);
    return {
        users: [user1],
        tweets: [tweet1, tweet2, tweet3, retweet1],
        trends: [trend1, trend2, trend3, trend4, trend5, trend6],
    };
};
describe('GET Trends', () => {
    test('should get trends', async () => {
        const { users, tweets, trends } = await createUserAndTrends();
        const token = generateToken(users[0].id);
        const response = await supertest(app)
            .get('/api/v1/trends')
            .query({ limit: 2, offset: 0 })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data.items).toHaveLength(2);
        expect(response.body.data.items[0].trend).toBe('trend1');
        expect(response.body.data.items[0].count).toBe(3);

        expect(response.body.data.items[1].trend).toBe('trend2');
        expect(response.body.data.items[1].count).toBe(2);
        expect(response.body.pagination.totalCount).toBe(3);
    });

    test('should get empty trends', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);
        const response = await supertest(app)
            .get('/api/v1/trends')
            .query({ limit: 2, offset: 0 })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data.items).toHaveLength(0);
    });

    test('should get no trends auth failed', async () => {
        const response = await supertest(app)
            .get('/api/v1/trends')
            .query({ limit: 2, offset: 0 })
            .expect(401);
    });
});
