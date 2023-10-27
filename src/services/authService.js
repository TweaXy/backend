import prisma from '../prisma.js';

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
export { setUserResetToken };
