import prisma from '../prisma.js';
import jwt from 'jsonwebtoken';
const setUserResetToken = async (id, token) => {
    return await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            ResetToken: token,
            ResetTokenCreatedAt: new Date().toISOString(),
        },
        select: {
            id: true,
        },
    });
};

const addTokenToBlacklist = async (token) => {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    await prisma.blockedTokens.create({
        data: {
            token,
            expiredDate: new Date(decode.exp * 1000),
        },
    });
};

const checkIfTokenIsBlacklisted = async (token) => {
    return await prisma.blockedTokens.findUnique({
        where: {
            token,
        },
    });
};
export { setUserResetToken, addTokenToBlacklist, checkIfTokenIsBlacklisted };
