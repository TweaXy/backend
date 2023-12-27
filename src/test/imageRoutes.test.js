/* eslint-disable no-undef */
import app from '../app.js';
import supertest from 'supertest';
import path from 'path';
import detenv from 'dotenv';
detenv.config({ path: path.resolve(__dirname, '../../test.env') });
describe('GET Images ', () => {
    test('GET Images succeessfully', async () => {
        await supertest(app)
            .get('/api/v1/images/b631858bdaafa77258b9ed2f7c689bdb.png')
            .send({})
            .expect(200);
    });
});
