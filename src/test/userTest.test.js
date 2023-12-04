/* eslint-disable no-undef */
import app from '../app';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { prismaMock } from '../singelton';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);

describe('POST users/checkUUIDExists', () => {
    test('checkUUIDExists if UUID exists', async () => {
        const password = await bcrypt.hash('12345678Aa@', 8);
        const user1 = {
            data: {
                id: 'cloudezgg0000356mmmnro8ze',
                email: 'ibrahim.Eman83@gmail.com',
                phone: '01285043196',
                username: 'sara_2121',
                name: 'Sara',
                birthdayDate: new Date('10-17-2023').toISOString(),
                password,
            },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
                birthdayDate: true,
                bio: true,
            },
        };

        prismaMock.user.create.mockResolvedValue(user1);
        console.log(await prismaMock.user.findMany({}));
        await supertest(app)
            .post('/api/v1/users/checkUUIDExists')
            .send({
                UUID: user1.email,
            })
            .expect(200);

        await supertest(app)
            .post('/api/v1/users/checkUUIDExists')
            .send({
                UUID: user1.phone,
            })
            .expect(200);

        await supertest(app)
            .post('/api/v1/users/checkUUIDExists')
            .send({
                UUID: user1.username,
            })
            .expect(200);
    });

    // test('checkUUIDExists if UUID does not exist', async () => {
    //     await supertest(app)
    //         .post('/api/v1/users/checkUUIDExists')
    //         .send({
    //             UUID: '01285043189',
    //         })
    //         .expect(404);
    // });
});

// describe('POST users/checkUsernameUniqueness', () => {
//     test('checkUsernameUniqueness if username exists', async () => {
//         const user1 = await fixtures.addUserToDB2();
//         await supertest(app)
//             .post('/api/v1/users/checkUsernameUniqueness')
//             .send({
//                 username: user1.username,
//             })
//             .expect(409);
//     });

//     test('checkUsernameUniqueness if username does not exist', async () => {
//         await supertest(app)
//             .post('/api/v1/users/checkUsernameUniqueness')
//             .send({
//                 username: 'saratytkl',
//             })
//             .expect(200);
//     });
// });

// describe('POST users/checkEmailUniqueness', () => {
//     test('checkEmailUniqueness if email exists', async () => {
//         const user1 = await fixtures.addUserToDB2();
//         await supertest(app)
//             .post('/api/v1/users/checkEmailUniqueness')
//             .send({
//                 email: user1.email,
//             })
//             .expect(409);
//     });

//     test('checkEmailUniqueness if email does not exist', async () => {
//         await supertest(app)
//             .post('/api/v1/users/checkEmailUniqueness')
//             .send({
//                 email: 'saral@gmail.com',
//             })
//             .expect(200);
//     });
// });

// describe('GET users/:id', () => {
//     test('check getUserById if Id exists', async () => {
//         const user1 = await fixtures.addUserToDB1();
//         await supertest(app)
//             .get(`/api/v1/users/${user1.id}`)
//             .send({})
//             .expect(200);
//     });

//     test('check getUserById if Id does not exist', async () => {
//         const user1 = await fixtures.addUserToDB1();
//         await supertest(app)
//             .get(`/api/v1/users/${user1.id}11`)
//             .send({})
//             .expect(404);
//     });
// });
