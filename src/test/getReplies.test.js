/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteInteractions);
describe('GET reply ', () => {
    test('get replies succeessfully', async () => {
        const user1 = await fixtures.addUserToDB3();
        const user2 = await fixtures.addUserToDB1();
        const user3 = await fixtures.addUserToDB2();
        const tweet = await fixtures.addTweetToDB(user2.id);
        const reply = await fixtures.addCommentToDB(tweet.id, user3.id);
        await fixtures.addCommentToDB(tweet.id, user1.id);
        await fixtures.addFollow(user3.id, user2.id);
        await fixtures.addLikes(reply, [user2]);
        const token = fixtures.generateToken(user2.id);
        await fixtures.addBlock(user2.id, user1.id);
        await fixtures.addMute(user2.id, user3.id);
        const response = await supertest(app)
            .get(`/api/v1/interactions/${tweet.id}/replies`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(200);
        console.log(response.body.data[0].mainInteraction);
        console.log(response.body.data[1].mainInteraction);
        expect(response.body.data[0].mainInteraction).toEqual(
            expect.objectContaining({
                type: 'COMMENT',
                user: expect.objectContaining({
                    id: user1.id,
                    username: user1.username,
                    name: user1.name,
                    avatar: null,
                    followedByMe: false,
                    followsMe: false,
                    mutedByMe: false,
                    blockedByMe: true,
                }),
                likesCount: 0,
                viewsCount: 0,
                retweetsCount: 0,
                commentsCount: 0,
                isUserInteract: expect.objectContaining({
                    isUserLiked: 0,
                    isUserRetweeted: 0,
                    isUserCommented: 0,
                }),
            })
        );
        expect(response.body.data[1].mainInteraction).toEqual(
            expect.objectContaining({
                type: 'COMMENT',
                user: expect.objectContaining({
                    id: user3.id,
                    username: user3.username,
                    name: user3.name,
                    avatar: null,
                    followedByMe: false,
                    followsMe: true,
                    mutedByMe: true,
                    blockedByMe: false,
                }),
                likesCount: 1,
                viewsCount: 0,
                retweetsCount: 0,
                commentsCount: 0,
                isUserInteract: expect.objectContaining({
                    isUserLiked: 1,
                    isUserRetweeted: 0,
                    isUserCommented: 0,
                }),
            })
        );
    });

    test('should handle 404 - Not found', async () => {
        const user1 = await fixtures.addUserToDB3();
        const token = fixtures.generateToken(user1.id);

        const response = await supertest(app)
            .get(`/api/v1/interactions/${user1.id}/replies`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'no interaction found '
        );
    });
    test('should handle 401 - No tweet body', async () => {
        const user1 = await fixtures.addUserToDB3();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const response = await supertest(app)
            .get(`/api/v1/interactions/${tweet.id}/replies`)
            .send({});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'fail');
    });
});
