/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

beforeEach(fixtures.deleteInteractions);
describe('GET interaction retweeters', () => {
    test('get retweeters of tweet successfully', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user3 = await fixtures.addUserToDB3();

        const tweet = await fixtures.addtweet(user1.id, 'bla');
        const token = await fixtures.generateToken(user1.id);

        await fixtures.addRetweetCommentToDB(user1.id, tweet.id, 'RETWEET');
        await fixtures.addRetweetCommentToDB(user3.id, tweet.id, 'RETWEET');
        const res = await supertest(app)
            .get(
                `/api/v1/interactions/${tweet.id}/retweeters/?limit=4&offset=0`
            )
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body.data.retweeters).toHaveLength(2);
        expect(res.body.data.retweeters[0].id).toEqual(user3.id);
        expect(res.body.data.retweeters[1].id).toEqual(user1.id);
    });
    test('expect 404--not found ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = await fixtures.generateToken(user1.id);
        await supertest(app)
            .get(
                `/api/v1/interactions/${user1.id}/retweeters/?limit=4&offset=0`)
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
           
            .send({})
            .expect(404);
    });
    test('expect 401 not authorized', async () => {
        await supertest(app)
            .get(
                '/api/v1/interactions/lol/retweeters/?limit=4&offset=0'
            )
            .send({})
            .expect(401);
    });
});
