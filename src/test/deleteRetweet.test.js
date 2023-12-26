/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteInteractions);
describe('DELETE retweet ', () => {
    test('delete retweet successfully', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const tweet = await fixtures.addTweetToDB(user1.id);
        // eslint-disable-next-line no-unused-vars
        const retweet = await fixtures.addRetweetCommentToDB(
            user2.id,
            tweet.id,
            'RETWEET'
        );

        const token = fixtures.generateToken(user2.id);

        await supertest(app)
            .delete(`/api/v1/interactions/retweet/${tweet.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const retweetFormDB = await fixtures.findInteraction(retweet.id);
        expect(retweetFormDB).toBeNull();
    });

    test('unsuccessfull delete retweet when user has no retweet ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const tweet = await fixtures.addTweetToDB(user1.id);
       
        const token = fixtures.generateToken(user2.id);

        await supertest(app)
            .delete(`/api/v1/interactions/retweet/${tweet.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400);

    });

    test('unsuccessfull delete retweet when tweet is not fount ', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        // eslint-disable-next-line no-unused-vars
        const tweet = await fixtures.addTweetToDB(user1.id);
       
        const token = fixtures.generateToken(user2.id);

        await supertest(app)
            .delete('/api/v1/interactions/retweet/blaaaaaa')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);

    });
});
