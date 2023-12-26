/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db.js';
import path from 'path';
import detenv from 'dotenv';
import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

describe('BLOCK/UNBLOCK', () => {
    test('successful block', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const token = generateToken(user1.id);
        
        await supertest(app)
            .post('/api/v1/users/block/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const block = await fixtures.findBlock(user1.id, user2.id);
        expect(block).not.toBeNull();
    });

    
    test('unsuccessful block when already blocked', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
       
        await fixtures.addBlock(user1.id, user2.id);
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/block/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(409);
    });

    test('unsuccessful block when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();
       
        const token = generateToken(user1.id);

        await supertest(app)
            .post('/api/v1/users/block/bla')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });

    test('successful unblock', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        
        await fixtures.addBlock(user1.id, user2.id);
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/block/' + user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const block = await fixtures.findBlock(user1.id, user2.id);
        expect(block).toBeNull();
    });

    

    test('unsuccessful unblock when already unblocked', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
       

        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/block/'+user2.username)
            .set('Authorization', `Bearer ${token}`)
            .expect(409);
    });

    test('unsuccessful unblock when user is not found', async () => {
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/block/bla')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });

    test('successful get block list', async () => {
        const user1 = await fixtures.addUserToDB1();
        const user2 = await fixtures.addUserToDB2();
        const user3 = await fixtures.addUserToDB3();

        await fixtures.addBlock(user1.id,user2.id);
        await fixtures.addBlock(user1.id,user3.id);
        const token = generateToken(user1.id);

        const res=await supertest(app)
            .get('/api/v1/users/block/list')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
            expect(res.body.data.blocks.length).toEqual(2);
            expect(res.body.data.blocks[1].id).toEqual(user3.id);
            expect(res.body.data.blocks[0].id).toEqual(user2.id);

    });
});
