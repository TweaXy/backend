/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteInteractions);
describe('POST reply ', () => {
    test('create reply succeessfully', async () => {
        const user1 = await fixtures.addUserToDB3();
        const user2 = await fixtures.addUserToDB1();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const token = fixtures.generateToken(user1.id);
        const response = await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/replies`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                text: `This is my first reply #dfg @${user2.username} `,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.reply).toMatchObject({
            text: `This is my first reply #dfg @${user2.username} `,
        });

        expect(response.body.data.mentionedUserData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: user2.email,
                    id: user2.id,
                    name: user2.name,
                    username: user2.username,
                }),
            ])
        );

        expect(response.body.data.trends).toEqual(
            expect.arrayContaining(['dfg'])
        );
    });

    test('should handle 404 - Not found', async () => {
        const user1 = await fixtures.addUserToDB3();
        const token = fixtures.generateToken(user1.id);

        const response = await supertest(app)
            .post(`/api/v1/interactions/${user1.id}/replies`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is my first tweet #dfg @sar2a_2121' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'no interaction by this id'
        );
    });
    test('should handle 400 - No tweet body', async () => {
        const user1 = await fixtures.addUserToDB3();
        const token = fixtures.generateToken(user1.id);
        const tweet = await fixtures.addTweetToDB(user1.id);
        const response = await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/replies`)
            .set('Authorization', `Bearer ${token}`) // Set the authorization token if needed
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'reply can not be empty'
        );
    });
});
