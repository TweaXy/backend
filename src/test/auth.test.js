/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
test('login a user', async () => {
    
    const user1=await fixtures.addUserToDB();
    await supertest(app).post('/api/v1/auth/login').send({
        UUID:user1.email,
        password:'12345678Aa@'
    }).expect(200);  //user login by email

    await supertest(app).post('/api/v1/auth/login').send({
        UUID:user1.username,
        password:'12345678Aa@'
    }).expect(200); //user login by username

   
}); 
test('login failed', async () => {
    const user1=await fixtures.addUserToDB();
    await supertest(app).post('/api/v1/auth/login').send({
        UUID:user1.email,
        password:'12345678Wa@'
    }).expect(401);   //wrong password


    await supertest(app).post('/api/v1/auth/login').send({
        UUID:'',
        password:'12345678Aa@'
    }).expect(403);   //email is empty 
    
}); 
    