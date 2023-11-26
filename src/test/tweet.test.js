/* eslint-disable no-undef */
import request from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';

beforeEach(fixtures.deleteUsers);
describe('POST tweet ', () => {
    test('create tweet', async () => {
        const user1 = await fixtures.addUserToDB3();
        const user2 = await fixtures.addUserToDB1();
        const token = fixtures.generateToken(user1.id);
        const response = await request(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                text: `This is my first tweet #dfg @${user2.username}`,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.tweet).toMatchObject({
            text: `This is my first tweet #dfg @${user2.username}`,
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
        await request(app)
            .post('/api/v1/auth/logout')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        const response = await request(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'This is my first tweet #dfg @sar2a_2121' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('message', 'token not valid');
    });
    test('should handle 400 - No tweet body', async () => {
        const user1 = await fixtures.addUserToDB3();
        const token = fixtures.generateToken(user1.id);
        const response = await request(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token}`) // Set the authorization token if needed
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty(
            'message',
            'tweet can not be empty'
        );
    });
});
