import prisma from '../../prisma.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const addUserToDB1 = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
        data: {
            email: 'ibrahim.Eman@gmail.com',
            phone: '01285043194',
            username: 'sar2a_2121',
            name: 'Sara',
            birthdayDate: new Date('10-17-2023').toISOString(),
            password,
        },
        select: {
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
            id: true,
        },
    });
};

const addUserToDB2 = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
        data: {
            email: 'ibrahim.Eman83@gmail.com',
            phone: '01285043196',
            username: 'sara_2121',
            name: 'Sara',
            birthdayDate: new Date('10-17-2023').toISOString(),
            password,
        },
        select: {
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
            id: true,
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
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
            id: true,
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

const deleteUsers = async () => {
    return await prisma.$queryRaw`DELETE FROM User;`;
};

const deleteInteractions = async () => {
    return await prisma.$queryRaw`DELETE FROM Interactions;`;
};

const deleteEmailVerification = async () => {
    return await prisma.emailVerificationToken.deleteMany();
};

module.exports = {
    addUserToDB1,
    addUserToDB2,
    addUserToDB3,
    addTweetToDB,
    addRetweetCommentToDB,
    likeInteraction,
    followUser,
    deleteUsers,
    deleteEmailVerification,
    deleteInteractions,
};
