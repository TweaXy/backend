import prisma from '../../prisma.js';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import { faker } from '@faker-js/faker';

const addUserToDB1 = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
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
    });
};

const addUserToDB2 = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
        data: {
            email: 'nesmaShafie342@gmail.com',
            phone: '01122429966',
            username: 'sara_3333',
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
    });
};

const addUserToDB3 = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
        data: {
            email: 'aliaagheis@gmail.com',
            phone: '01069871745',
            username: 'aliaagheis',
            name: 'aliaa',
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
    });
};

const addTweetToDB = async (authorId) => {
    return await prisma.interactions.create({
        data: {
            user: {
                connect: {
                    id: authorId,
                },
            },
            text: faker.lorem.sentence(),
            type: 'TWEET',
            media: {
                createMany: {
                    data: [
                        { fileName: faker.image.urlPlaceholder() },
                        { fileName: faker.image.urlPlaceholder() },
                    ],
                    skipDuplicates: true,
                },
            },
        },
    });
};

const addRetweetCommentToDB = async (authorId, parentId, type) => {
    return await prisma.interactions.create({
        data: {
            user: {
                connect: {
                    id: authorId,
                },
            },
            text: faker.lorem.sentence(),
            type: type,
            media: {
                createMany: {
                    data: [
                        { fileName: faker.image.urlPlaceholder() },
                        { fileName: faker.image.urlPlaceholder() },
                    ],
                    skipDuplicates: true,
                },
            },
            parentInteraction: {
                connect: {
                    id: parentId,
                },
            },
        },
    });
};

const likeInteraction = async (userId, interactionId) => {
    return await prisma.likes.create({
        data: {
            userID: userId,
            interactionID: interactionId,
        },
    });
};

const followUser = async (userId, followingUserId) => {
    return await prisma.follow.create({
        data: {
            userID: userId,
            followingUserID: followingUserId,
        },
    });
};

const addFollow = async (followerId, followingId) => {
    await prisma.follow.create({
        data: {
            userID: followerId,
            followingUserID: followingId,
        },
    });
};

const addVerificationToken = async (email, token, date = Date.now()) => {
    await prisma.emailVerificationToken.create({
        data: {
            email,
            token,
            lastUpdatedAt: new Date(date),
        },
    });
};

const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
};

const findFollow = async (followerId, followingId) => {
    return await prisma.follow.findUnique({
        where: {
            userID_followingUserID: {
                userID: followerId,
                followingUserID: followingId,
            },
        },
    });
};

const deleteFollows = async () => {
    return await prisma.follow.deleteMany({});
};

const deleteUsers = async () => {
    return await prisma.$queryRaw`DELETE FROM User;`;
};
const deleteInteractions = async () => {
    return await prisma.$queryRaw`DELETE FROM Interactions;`;
};
const deleteBlockedTokens = async () => {
    return await prisma.blockedTokens.deleteMany();
};
const deleteEmailVerification = async () => {
    return await prisma.emailVerificationToken.deleteMany();
};
const addtweet = async (userid) => {
    return await prisma.interactions.create({
        data: {
            userID: userid,
            text: 'lol lol lol ',
        },
    });
};

const addTrendToDB = async (trend, interactionID) => {
    return await prisma.trendsInteractions.create({
        data: {
            trend,
            interactionID,
        },
    });
};

const generateToken = (id) => {
    const token = jwt.sign({ id: JSON.stringify(id) }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
    });

    return token;
};
const addLikes = async (tweet, users) => {
    let i;
    for (i = 0; i < users.length; i++) {
        await prisma.likes.create({
            data: {
                userID: users[i].id,
                interactionID: tweet.id,
            },
        });
    }
};
module.exports = {
    addUserToDB1,
    addUserToDB2,
    addUserToDB3,
    addFollow,
    addVerificationToken,
    findUserById,
    findFollow,
    deleteFollows,
    deleteBlockedTokens,
    addTweetToDB,
    addRetweetCommentToDB,
    likeInteraction,
    followUser,
    deleteUsers,
    deleteEmailVerification,
    addtweet,
    addTrendToDB,
    generateToken,
    deleteInteractions,
    addLikes,
};
