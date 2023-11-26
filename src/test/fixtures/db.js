import prisma from '../../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
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
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
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
const addtweet = async (userid) => {
    return await prisma.interactions.create({
        data: {
            userID: userid,
            text: 'lol lol lol ',
        },
    });
};
const generateToken = (id) => {
    const token = jwt.sign({ id: JSON.stringify(id) }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
    });

    return token;
};
module.exports = {
    addUserToDB1,
    addUserToDB2,
    addUserToDB3,
    deleteUsers,
    deleteEmailVerification,
    addtweet,
    generateToken,
    deleteInteractions,
};
