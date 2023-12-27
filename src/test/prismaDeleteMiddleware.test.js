/* eslint-disable no-undef */
import fixtures from './fixtures/db';
import path from 'path';
import detenv from 'dotenv';
import prisma from '../prisma.js';

detenv.config({ path: path.resolve(__dirname, '../../test.env') });
beforeEach(fixtures.deleteUsers);
beforeEach(fixtures.deleteBlockedTokens);

describe('Prisma delete Middleware', () => {
    it('should call sendErrorProd in production environment', async () => {
        process.env.NODE_ENV = 'production';
        await fixtures.addUserToDB1();

        await prisma.user.deleteMany({});

        const usersDB = await prisma.user.findMany({});

        expect(usersDB).toHaveLength(0);
    });
});
