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
describe('DELETE interaction', () => {
    test('delete interaction successfully', async () => {
        const user1 = await fixtures.addUserToDB2();
        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);
        await supertest(app)
            .delete(`/api/v1/interactions/${tweet.id}`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(
            await prisma.interactions.findUnique({
                where: {
                    id: tweet.id,
                },
            })
        ).toBeNull();
    });

    test('delete interaction failed', async () => {
        const user1 = await fixtures.addUserToDB2();
        const user2 = await fixtures.addUserToDB1();
        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user2.id);
        //unauthorized user
        await supertest(app)
            .delete(`/api/v1/interactions/${tweet.id}`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
        //non existing tweet
        await supertest(app)
            .delete(`/api/v1/interactions/${user1.id}`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(
            await prisma.interactions.findUnique({
                where: {
                    id: tweet.id,
                },
            })
        ).not.toBeNull();
    });
});
