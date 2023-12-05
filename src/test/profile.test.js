/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
// import { generateToken } from '../utils/index.js';
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

describe('profile tweets', () => {
    test('should get profile tweets', async () => {
        const { users, tweets, comments } = await createUserAndTweets();

        await fixtures.likeInteraction(users[0].id, tweets[0].id);

        const response = await supertest(app)
            .get(`/api/v1/users/${users[0].id}/tweets`)
            .query({ limit: 2, offset: 1 });

        // Check status code and basic structure
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.data).toHaveProperty('items');
        expect(response.body.data.items.data).toBeInstanceOf(Array);

        // Check pagination properties
        expect(response.body.pagination).toHaveProperty('totalCount');
        expect(response.body.pagination).toHaveProperty('nextPage');
        expect(response.body.pagination).toHaveProperty('prevPage');

        // Additional checks on the content of the response
        const { data, pagination } = response.body;
        const { items } = data;

        expect(pagination.totalCount).toBe(3);
        expect(pagination.nextPage).toBeNull();
        expect(pagination.prevPage).toContain('limit=2&offset=0');

        expect(items.data.length).toBe(2);
        expect(items.data[0].mainInteraction).toHaveProperty(
            'id',
            tweets[1].id
        );

        const userInteract1 = items.data[1].mainInteraction.isUserInteract;
        expect(userInteract1).toHaveProperty('isUserLiked', 1);
        expect(userInteract1).toHaveProperty('isUserRetweeted', 0);
        expect(userInteract1).toHaveProperty('isUserCommented', 0);
    });

    test('should not get profile tweets due to wrong id', async () => {
        const user1 = await fixtures.addUserToDB1();
        await supertest(app)
            .get(`/api/v1/users/${user1.id}11/tweets`)
            .query({ limit: 2, offset: 1 })
            .expect(404);
    });
});

describe('profile likes', () => {
    test('should get profile likes', async () => {
        const { users, tweets, retweets } = await createUserAndTweets();

        await fixtures.likeInteraction(users[0].id, tweets[2].id);
        await fixtures.likeInteraction(users[0].id, tweets[0].id);

        const response = await supertest(app)
            .get(`/api/v1/users/${users[0].id}/tweets/liked`)
            .query({ limit: 3, offset: 0 });

        // Check status code and basic structure
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.data).toHaveProperty('items');
        expect(response.body.data.items.data).toBeInstanceOf(Array);

        // Check pagination properties
        expect(response.body.pagination).toHaveProperty('totalCount');
        expect(response.body.pagination).toHaveProperty('nextPage');
        expect(response.body.pagination).toHaveProperty('prevPage');

        // Additional checks on the content of the response
        const { data, pagination } = response.body;
        const { items } = data;

        expect(pagination.totalCount).toBe(2);
        expect(pagination.nextPage).toBeNull();
        expect(pagination.prevPage).toBeNull();

        expect(items.data.length).toBe(2);

        const userInteract1 = items.data[0].mainInteraction.isUserInteract;
        expect(userInteract1).toHaveProperty('isUserLiked', 1);
        expect(userInteract1).toHaveProperty('isUserRetweeted', 0);
        expect(userInteract1).toHaveProperty('isUserCommented', 0);

        const userInteract2 = items.data[1].mainInteraction.isUserInteract;
        expect(userInteract2).toHaveProperty('isUserLiked', 1);
        expect(userInteract2).toHaveProperty('isUserRetweeted', 0);
        expect(userInteract2).toHaveProperty('isUserCommented', 0);

        // expect(items[1].mainInteraction).toHaveProperty('id', tweets[2].id);
    });

    test('should not get profile likes due to wrong id', async () => {
        const user1 = await fixtures.addUserToDB1();
        await supertest(app)
            .get(`/api/v1/users/${user1.id}11/tweets/liked`)
            .query({ limit: 2, offset: 1 })
            .expect(404);
    });
});
