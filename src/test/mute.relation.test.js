/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

describe('MUTE/UNMUTE', () => {
    test('successful mute', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const token = generateToken(user1.id);
        
        await supertest(app)
            .post('/api/v1/users/mute/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const mute = await fixtures.findMute(user1.id, user2.id);
        expect(mute).not.toBeNull();
    });

    
    test('unsuccessful mute when already muted', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
       
        await fixtures.addMute(user1.id, user2.id);
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/mute/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(409);
    });

    test('unsuccessful mute when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();
       
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/mute/bla')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
    test('unsuccessful mute when user is muting himself', async () => {
        const user1 = await fixtures.addUserToDB1();
       
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/mute/'+user1.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });

    test('successful unmute', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
       
        await fixtures.addMute(user1.id, user2.id);
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/mute/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const mute = await fixtures.findMute(user1.id, user2.id);
        expect(mute).toBeNull();
    });

    

    test('unsuccessful unmute when already unmuted', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
       
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/mute/'+user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(409);
    });

    test('unsuccessful unmute when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/mute/bla')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });

    test('successful get mute list', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addMute(user1.id,user2.id);
        await fixtures.addMute(user1.id,user3.id);
        const token = generateToken(user1.id);

        const res=await supertest(app)
            .get('/api/v1/users/mute/list')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
            expect(res.body.data.mutes.length).toEqual(2);
            expect(res.body.data.mutes[1].id).toEqual(user3.id);
            expect(res.body.data.mutes[0].id).toEqual(user2.id);

    });
});
