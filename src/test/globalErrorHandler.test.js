/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import { generateToken } from '../utils/index.js';

detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteBlockedTokens);

describe('globalErrorHandlerMiddleware', () => {
    it('should call sendErrorProd in production environment', async () => {
        process.env.NODE_ENV = 'production';
        const user1 = await fixtures.addUserToDB1();
        const token = generateToken(user1.id);

        await supertest(app)
            .delete('/api/v1/users/profilePicture')
            .set({ Authorization: `Bearer ${token}` })
            .expect(409);
    });

    afterEach(() => {
        process.env.NODE_ENV = 'test'; // Reset the environment variable after the test
    });
});
