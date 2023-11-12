import prisma from '../../prisma.js';
import bcrypt from 'bcryptjs';
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
        },
    });
};

const deleteUsers = async () => {
    return await prisma.$queryRaw`DELETE FROM User;`;
};

const deleteEmailVerification = async () => {
    return await prisma.emailVerificationToken.deleteMany();
};

module.exports = {
    addUserToDB1,
    addUserToDB2,
    deleteUsers,
    deleteEmailVerification,
};
