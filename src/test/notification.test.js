/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

describe('GET notification', () => {
    test('get all notifications', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();
        const tweet = await fixtures.addTweetToDB(user1.id);
        const token1 = generateToken(user1.id);
        const token2 = generateToken(user2.id);
        const token3 = generateToken(user3.id);

        await supertest(app)
            .post('/api/v1/tweets')
            .set('Authorization', `Bearer ${token2}`)
            .send({ text: `hello @${user1.username}` });

        await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/like`)
            .set('Authorization', `Bearer ${token2}`);
        await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/like`)
            .set('Authorization', `Bearer ${token3}`); //likes
        await supertest(app)
            .post(`/api/v1/interactions/${tweet.id}/replies`)
            .set('Authorization', `Bearer ${token3}`)
            .send({ text: 'dsffds' }); //replying

        const res = await supertest(app)
            .get('/api/v1/notification/?limit10=&offset=0')
            .set('Authorization', `Bearer ${token1}`)
            .expect(200);
        expect(res.body.data.notifications[0]).toEqual(
            expect.objectContaining({
                action: 'REPLY',
                interaction: expect.objectContaining({ id: tweet.id }),
                fromUser: expect.objectContaining({ id: user3.id }),
                text: `${user3.username} has replied to your TWEET`,
            })
        );
        expect(res.body.data.notifications[1]).toEqual(
            expect.objectContaining({
                action: 'LIKE',
                interaction: expect.objectContaining({ id: tweet.id }),
                fromUser: expect.objectContaining({ id: user3.id }),
                text: `${user3.username} and others have Liked your TWEET`,
            })
        );
        expect(res.body.data.notifications[2]).toEqual(
            expect.objectContaining({
                action: 'MENTION',
                fromUser: expect.objectContaining({ id: user2.id }),
                text: `${user2.username} has mentioned you in a TWEET`,
            })
        );
        console.log(res.body.data);
    });
});
