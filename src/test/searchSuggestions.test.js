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

    const token1 = generateToken(user1.id);
    const token2 = generateToken(user2.id);

    const tweetsText = [
        'This is my first test #test',
        'This is my second #test test',
        'This is my third test',
    ];

    for (const text of tweetsText) {
        await supertest(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token1}`)
            .send({ text });
    }

    return { user1, user2, token1, token2 };
};

const createUserAndTweets1 = async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();

    const token1 = generateToken(user1.id);
    const token2 = generateToken(user2.id);

    const tweetsText = ['#test #mytest #my my test is so clear'];

    for (const text of tweetsText) {
        await supertest(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token1}`)
            .send({ text });
    }

    return { user1, user2, token1, token2 };
};

describe('Tweets search suggestions API', () => {
    test('should get suggestions from db using keyword', async () => {
        const { token2 } = await createUserAndTweets();

        const response = await supertest(app)
            .get('/api/v1/tweets/suggest')
            .query({ keyword: 'test' })
            .set('Authorization', `Bearer ${token2}`);

        // Check status code and basic structure
        expect(response.statusCode).toBe(200);

        const items = response.body.data.items;
        // Check data
        expect(items).toHaveLength(3);
        expect(items[0]).toHaveProperty('rightSnippet', '#test');
        expect(items[0]).toHaveProperty('leftSnippet', 'first test #test');

        expect(items[1]).toHaveProperty('rightSnippet', '#test test');
        expect(items[1]).toHaveProperty('leftSnippet', 'my second #test');

        expect(items[2]).toHaveProperty('rightSnippet', 'test');
        expect(items[2]).toHaveProperty('leftSnippet', 'my third test');
    });

    test('should get suggestions from db using long text', async () => {
        const { token2 } = await createUserAndTweets1();

        const response = await supertest(app)
            .get('/api/v1/tweets/suggest')
            .query({ keyword: 'my test is' })
            .set('Authorization', `Bearer ${token2}`);

        // Check status code and basic structure
        expect(response.statusCode).toBe(200);

        const items = response.body.data.items;
        console.log(items);
        // Check data
        expect(items).toHaveLength(1);

        expect(items[0]).toHaveProperty('rightSnippet', 'my test is so clear');
        expect(items[0]).toHaveProperty(
            'leftSnippet',
            '#mytest #my my test is'
        );

        // expect(items[2]).toHaveProperty('rightSnippet', 'test');
        // expect(items[2]).toHaveProperty('leftSnippet', 'my third test');
    });

    test('should handle authentication failure with invalid credentials', async () => {
        await supertest(app)
            .get('/api/v1/tweets/suggest')
            .query({ limit: 2, offset: 1 })
            .expect(401);
    });
});
