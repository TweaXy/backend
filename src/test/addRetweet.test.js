/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteInteractions);
describe('POST retweet ', () => {
    test('repost tweet successfully', async () => {
        const user1 = await fixtures.addUserToDB3();
        const user2 = await fixtures.addUserToDB1();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const token = fixtures.generateToken(user2.id);

        const response = await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/retweet`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(201);
        expect(response.body.data).toEqual(
            expect.objectContaining({
                parentInteractionID: tweet.id,
                userID: user2.id,
                parentInteraction: expect.objectContaining({
                    id: tweet.id,
                    userID: user1.id,
                }),
            })
        );
    });

    test('repost comment successfully', async () => {
        const user1 = await fixtures.addUserToDB3();
        const user2 = await fixtures.addUserToDB1();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const comment = await fixtures.addRetweetCommentToDB(
            user1.id,
            tweet.id,
            'COMMENT'
        );
        const token = fixtures.generateToken(user2.id);

        const response = await supertest(app)
            .post(`/api/v1/interactions/${comment.id}/retweet`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(201);
        expect(response.body.data).toEqual(
            expect.objectContaining({
                parentInteractionID: comment.id,
                userID: user2.id,
                parentInteraction: expect.objectContaining({
                    id: comment.id,
                    userID: user1.id,
                }),
            })
        );
    });

    test('repost retweet successfully', async () => {
        const user1 = await fixtures.addUserToDB3();
        const user2 = await fixtures.addUserToDB1();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const retweet = await fixtures.addRetweetCommentToDB(
            user1.id,
            tweet.id,
            'RETWEET'
        );
        const token = fixtures.generateToken(user2.id);

        const response = await supertest(app)
            .post(`/api/v1/interactions/${retweet.id}/retweet`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(201);
        expect(response.body.data).toEqual(
            expect.objectContaining({
                parentInteractionID: retweet.parentInteractionID,
                userID: user2.id,
                parentInteraction: expect.objectContaining({
                    id: retweet.parentInteractionID,
                    userID: user1.id,
                }),
            })
        );
    });

    test('repost retweet unsuccessfully', async () => {
        const user1 = await fixtures.addUserToDB3();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const retweet = await fixtures.addRetweetCommentToDB(
            user1.id,
            tweet.id,
            'RETWEET'
        );
        const token = fixtures.generateToken(user1.id);

        const response = await supertest(app)
            .post(`/api/v1/interactions/${retweet.id}/retweet`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(409);
    });

    test('should handle 404 - Not found', async () => {
        const user1 = await fixtures.addUserToDB3();
        const token = fixtures.generateToken(user1.id);

        const response = await supertest(app)
            .post(`/api/v1/interactions/${user1.id}/retweet`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'no interaction by this id'
        );
    });
    test('should handle 401 - not authorized', async () => {
        const user1 = await fixtures.addUserToDB3();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const response = await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/retweet`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('message', 'no token provided');
    });
});
