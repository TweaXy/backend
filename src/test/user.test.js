/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import { token } from 'morgan';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteFollows);
test('checkUUIDExists if UUID exists', async () => {
    
    const user1=await fixtures.addUserToDB();
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
    
    const user1=await fixtures.addUserToDB();
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
    
    const user1=await fixtures.addUserToDB();
    await supertest(app).post('/api/v1/users/checkEmailUniqueness').send({
        email:user1.email,
    }).expect(409);
    
      
}); 
    
test('checkEmailUniqueness if email does not exist', async () => {
        
    
    await supertest(app).post('/api/v1/users/checkEmailUniqueness').send({
        email:'saral@gmail.com',
    }).expect(200);
}); 

test('successful follow', async () => {


    const user1=await fixtures.addUserToDB();  
    const user2= await fixtures.addAnotherUserToDB(); 
    const token=fixtures.generateToken(user1.id);
 
    await supertest(app)
    .post('/api/v1/users/follow/'+user2.username)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
}); 

test('unsuccessful follow when user not fount', async () => {


    const user1=await fixtures.addUserToDB();  
    const token=fixtures.generateToken(user1.id);
 
    await supertest(app)
    .post('/api/v1/users/follow/blabla')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
}); 

test('unsuccessful follow when already follow', async () => {


    const user1=await fixtures.addUserToDB();  
    const user2= await fixtures.addAnotherUserToDB(); 
    await fixtures.addFollow(user1.id,user2.id);
    const token=fixtures.generateToken(user1.id);
 
    await supertest(app)
    .post('/api/v1/users/follow/'+user2.username)
    .set('Authorization', `Bearer ${token}`)
    .expect(409);
}); 


test('successful unfollow', async () => {


    const user1=await fixtures.addUserToDB();  
    const user2= await fixtures.addAnotherUserToDB(); 
    await fixtures.addFollow(user1.id,user2.id);
    const token=fixtures.generateToken(user1.id);
 
    await supertest(app)
    .delete('/api/v1/users/follow/'+user2.username)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
}); 

test('unsuccessful unfollow when user not found', async () => {


    const user1=await fixtures.addUserToDB();  
    const token=fixtures.generateToken(user1.id);
 
    await supertest(app)
    .delete('/api/v1/users/follow/blabla')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
}); 

test('unsuccessful unfollow when already unfollowed', async () => {


    const user1=await fixtures.addUserToDB();
    const user2=await fixtures.addAnotherUserToDB(); 
    const token=fixtures.generateToken(user1.id);
 
    await supertest(app)
    .delete('/api/v1/users/follow/'+user2.username)
    .set('Authorization', `Bearer ${token}`)
    .expect(409);
}); 
   