/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import path from 'path';
import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../app';
import fixtures from './fixtures/db';
import { generateToken } from '../utils/index.js';
import prisma from '../prisma.js';
dotenv.config({ path: path.resolve(__dirname, '../../test.env') });

beforeEach(fixtures.deleteUsers);

const createUserAndConversation = async () => {
    const user1 = await fixtures.addUserToDB1();
    const user2 = await fixtures.addUserToDB2();
    const token1 = generateToken(user1.id);
    const token2 = generateToken(user2.id);
    const conversation = await prisma.conversations.create({
        data: {
            user1ID: user1.id,
            user2ID: user2.id,
        },
    });
    return { user1, user2, token1, token2, conversation };
};
const addMessageToConversation = async (
    conversationID,
    senderId,
    receiverId
) => {
    return await prisma.directMessages.create({
        data: {
            conversationID,
            senderId,
            receiverId,
            text: 'hello',
        },
    });
};

describe('Conversation API', () => {
    describe('Create Conversation', () => {
        test('POST: create conversation successfully', async () => {
            const user1 = await fixtures.addUserToDB1();
            const user2 = await fixtures.addUserToDB2();
            const token1 = generateToken(user1.id);
            const token2 = generateToken(user2.id);

            const conversation = await supertest(app)
                .post('/api/v1/conversations')
                .set('Authorization', `Bearer ${token1}`)
                .send({ UUID: user2.username })
                .expect(201);
        });
        test('POST: duplicate conversation', async () => {
            const { user1, token2 } = await createUserAndConversation();

            await supertest(app)
                .post('/api/v1/conversations')
                .set('Authorization', `Bearer ${token2}`)
                .send({ UUID: user1.username })
                .expect(200);
        });

        test('POST: create conversation with non existing user', async () => {
            const user1 = await fixtures.addUserToDB1();
            const token1 = generateToken(user1.id);
            await supertest(app)
                .post('/api/v1/conversations')
                .set('Authorization', `Bearer ${token1}`)
                .send({ UUID: 'aaaa' })
                .expect(404);
        });

        test('POST: create conversation with empty UUID', async () => {
            const user1 = await fixtures.addUserToDB1();
            const token1 = generateToken(user1.id);
            await supertest(app)
                .post('/api/v1/conversations')
                .set('Authorization', `Bearer ${token1}`)
                .expect(403);
        });
    });

    describe('Create Message', () => {
        test('POST: create message successfully', async () => {
            const { token1, conversation } = await createUserAndConversation();

            await supertest(app)
                .post(`/api/v1/conversations/${conversation.id}`)
                .set('Authorization', `Bearer ${token1}`)
                .send({ text: 'hello' })
                .expect(201);
        });
        test('POST: create message with empty text', async () => {
            const { token1, conversation } = await createUserAndConversation();

            await supertest(app)
                .post(`/api/v1/conversations/${conversation.id}`)
                .set('Authorization', `Bearer ${token1}`)
                .expect(403);
        });

        test('POST: create message with non existing conversation', async () => {
            const { token1 } = await createUserAndConversation();

            await supertest(app)
                .post('/api/v1/conversations/aaaa')
                .set('Authorization', `Bearer ${token1}`)
                .send({ text: 'hello' })
                .expect(404);
        });
        test('POST: create message with user not part of conversation', async () => {
            const { token1, conversation } = await createUserAndConversation();
            const user3 = await fixtures.addUserToDB3();
            const token3 = generateToken(user3.id);

            await supertest(app)
                .post(`/api/v1/conversations/${conversation.id}`)
                .set('Authorization', `Bearer ${token3}`)
                .send({ text: 'hello' })
                .expect(404);
        });
    });

    describe('Get Conversation', () => {
        test('GET: get conversation successfully', async () => {
            const { token1, conversation } = await createUserAndConversation();

            const {
                body: { data },
            } = await supertest(app)
                .get('/api/v1/conversations')
                .set('Authorization', `Bearer ${token1}`)
                .expect(200);
            expect(data.items.length).toBe(1);
            expect(data.items[0]).toHaveProperty('id', conversation.id);
        });
    });

    describe('Get Unseen Conversation count ', () => {
        test('GET: get unseen conversation successfully', async () => {
            const { user1, user2, token1, token2, conversation } =
                await createUserAndConversation();
            await addMessageToConversation(conversation.id, user1.id, user2.id);
            await addMessageToConversation(conversation.id, user1.id, user2.id);

            const {
                body: { data },
            } = await supertest(app)
                .get('/api/v1/conversations/unseen')
                .set('Authorization', `Bearer ${token2}`)
                .expect(200);
            expect(data.unseenConversations).toBe(1);
        });

        test('GET: get unseen conversation with non existing conversation', async () => {
            const user1 = await fixtures.addUserToDB1();
            const token1 = generateToken(user1.id);

            const {
                body: { data },
            } = await supertest(app)
                .get('/api/v1/conversations/unseen')
                .set('Authorization', `Bearer ${token1}`)
                .expect(200);
            expect(data.unseenConversations).toBe(0);
        });
    });

    describe('Get Conversation Messages', () => {
        test('GET: get conversation messages successfully', async () => {
            const { user1, user2, token1, token2, conversation } =
                await createUserAndConversation();
            await addMessageToConversation(conversation.id, user1.id, user2.id);
            await addMessageToConversation(conversation.id, user1.id, user2.id);

            const {
                body: { data },
            } = await supertest(app)
                .get(`/api/v1/conversations/${conversation.id}`)
                .set('Authorization', `Bearer ${token2}`)
                .expect(200);
            expect(data.items.length).toBe(2);
        });

        test('GET: get conversation messages with non existing conversation', async () => {
            const user1 = await fixtures.addUserToDB1();
            const token1 = generateToken(user1.id);

            const {
                body: { data },
            } = await supertest(app)
                .get('/api/v1/conversations/aaaa')
                .set('Authorization', `Bearer ${token1}`)
                .expect(404);
        });
    });
});
