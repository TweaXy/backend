import prisma from '../prisma.js';

const setUserResetToken = async (email, token) => {
    return await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            ResetToken: token,
            ResetTokenCreatedAt: new Date().toISOString(),
        },
    });
};
export { setUserResetToken };
