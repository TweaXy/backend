/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
// import prisma from '../prisma';
// import { generateToken } from '../utils/index.js';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach( fixtures.deleteUsers);
test('checkUUIDExists if UUID exists', async () => {
    
    const user1=await fixtures.addUserToDB2();
    await supertest(app).post('/api/v1/users/checkUUIDExists').send({
        UUID:user1.email,
    }).expect(200);

    await supertest(app).post('/api/v1/users/checkUUIDExists').send({
        UUID:user1.phone,
    }).expect(200);

    await supertest(app).post('/api/v1/users/checkUUIDExists').send({
        UUID:user1.username,
    }).expect(200);
}); 

test('checkUUIDExists if UUID does not exist', async () => {
    
    await supertest(app).post('/api/v1/users/checkUUIDExists').send({
        UUID:'01285043189',
    }).expect(404);
}); 
    
test('checkUsernameUniqueness if username exists', async () => {
    
    const user1=await fixtures.addUserToDB2();
    await supertest(app).post('/api/v1/users/checkUsernameUniqueness').send({
        username:user1.username,
    }).expect(409);
        
          
}); 
        
test('checkUsernameUniqueness if username does not exist', async () => {
            
    await supertest(app).post('/api/v1/users/checkUsernameUniqueness').send({
        username:'saratytkl',
    }).expect(200);
}); 


test('checkEmailUniqueness if email exists', async () => {
    
    const user1=await fixtures.addUserToDB2();
    await supertest(app).post('/api/v1/users/checkEmailUniqueness').send({
        email:user1.email,
    }).expect(409);
    
      
}); 
    
test('checkEmailUniqueness if email does not exist', async () => {
        
    await supertest(app).post('/api/v1/users/checkEmailUniqueness').send({
        email:'saral@gmail.com',
    }).expect(200);
}); 


test('check getUserById if Id exists', async () => {
    const user1 = await fixtures.addUserToDB1();
    await supertest(app).get(`/api/v1/users/${user1.id}`).send({
    }).expect(200);
}); 


test('check getUserById if Id does not exist', async () => {
    const user1=await fixtures.addUserToDB1();
    await supertest(app).get(`/api/v1/users/${user1.id}11`).send({
    }).expect(404);
}); 
        

// test('check edit profile info', async () => {
//     const user1 = await fixtures.addUserToDB1();
//     const token = generateToken(user1.id);
//     await supertest(app).patch('/api/v1/users/')
//         .set({ Authorization: `Bearer ${token}` })
//         .send({})
//         .expect(200);
    // const newUser = prisma.user.findUnique({
    //     where: {
    //         id: user1.id
    //     }
    // });

    // expect(newUser.name).toBe('nesmaShafie');

    
// }); 
        