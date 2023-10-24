import prisma from '../prisma.js';

const getEmailVerificationToken = async (email) => {
    return await prisma.emailVerificationToken.findUnique({
        where: {
            email: email,
        },
    });
};

const createEmailVerificationToken = async (email, token) => {
    return await prisma.emailVerificationToken.create({
        data: {
            email: email,
            token: token,
        },
    });
};

const updateEmailVerificationToken = async (email, token) => {
    return await prisma.emailVerificationToken.update({
        where: {
            email: email,
        },
        data: {
            token: token,
        },
    });
};

const deleteEmailVerificationToken = async (email) => {
    return await prisma.emailVerificationToken.delete({
        where: {
            email: email,
        },
    });
};

export {
    getEmailVerificationToken,
    createEmailVerificationToken,
    updateEmailVerificationToken,
    deleteEmailVerificationToken,
};
