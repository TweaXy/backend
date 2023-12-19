/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
import prisma from '../prisma.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

beforeEach(fixtures.deleteInteractions);
describe('GET interaction likers', () => {
    test('get likers successfully', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);
        await fixtures.addLikes(tweet, [user2, user3, user1]);
        await fixtures.addBlock(user1.id,user3.id);
        const res = await supertest(app)
            .get(`/api/v1/interactions/${tweet.id}/likers/?limit=4&offset=0`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
            console.log(res.body.likers);
        expect(res.body.data.likers).toHaveLength(2);
        expect(res.body.data.likers[0].id).toEqual(user1.id);
        expect(res.body.data.likers[1].id).toEqual(user2.id);
       
           
    });
    test('get likers if id is incorrect ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = await fixtures.generateToken(user1.id);
        await supertest(app)
            .get(`/api/v1/interactions/${user1.id}/likers/?limit=4&offset=0`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
describe('POST Like  ', () => {
    test('Like an interaction successfully', async () => {
        const user1 = await fixtures.addUserToDB1();

        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);
        await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/like`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        expect(
            await prisma.likes.findUnique({
                where: {
                    userID_interactionID: {
                        userID: user1.id,
                        interactionID: tweet.id,
                    },
                },
            })
        ).not.toBeNull();
    });
    test('Like an interaction unsuccessfully expected 409', async () => {
        const user1 = await fixtures.addUserToDB1();

        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);
        await fixtures.addLikes(tweet, [user1]);
        await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/like`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(409);
    });
    test('Like an interaction unsuccessfully expected 404', async () => {
        const user1 = await fixtures.addUserToDB1();

        const token = await fixtures.generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/interactions/{gfgh}/like')
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
describe('DELETE Like ', () => {
    test('remove Like from interaction successfully', async () => {
        const user1 = await fixtures.addUserToDB1();

        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);
        await fixtures.addLikes(tweet, [user1]);
        await supertest(app)
            .delete(`/api/v1/interactions/${tweet.id}/like`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(
            await prisma.likes.findUnique({
                where: {
                    userID_interactionID: {
                        userID: user1.id,
                        interactionID: tweet.id,
                    },
                },
            })
        ).toBeNull();
    });
    test('remove Like from interaction  unsuccessfully expected 409', async () => {
        const user1 = await fixtures.addUserToDB1();

        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);
        await supertest(app)
            .delete(`/api/v1/interactions/${tweet.id}/like`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(409);
    });
    test('remove Like from interaction  unsuccessfully expected 404', async () => {
        const user1 = await fixtures.addUserToDB1();

        const token = await fixtures.generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/interactions/{gfgh}/like')
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});
