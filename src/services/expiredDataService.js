import prisma from '../prisma.js';

/**
 * remove expired blocked tokens
 * @async
 * @method
 */
const deleteExpiredBlockedTokens = async () => {
    const expiredBlockedTokens = await prisma.blockedTokens.deleteMany({
        where: {
            expiredDate: {
                lte: new Date(),
            },
        },
    });
    return expiredBlockedTokens;
};

/**
 * remove expired blocked tokens
 * @async
 * @method
 */
const deleteExpiredVerificationTokens = async () => {
    const expiredVerificationTokens =
        await prisma.emailVerificationToken.deleteMany({
            where: {
                lastUpdatedAt: {
                    lte: new Date(
                        Date.now() -
                            process.env.VERIFICATION_TOKEN_EXPIRES_IN_HOURS *
                                60 *
                                60 *
                                1000
                    ),
                },
            },
        });
    return expiredVerificationTokens;
};

/**
 * remove expired blocked tokens
 * @async
 * @method
 */
// const removeSoftData = async (table) => {
//     await prisma.$executeRaw`DELETE FROM ${table} WHERE
//     DeleteDate IS NOT NULL AND DELE`
// };

export default {
    deleteExpiredBlockedTokens,
    deleteExpiredVerificationTokens,
};
