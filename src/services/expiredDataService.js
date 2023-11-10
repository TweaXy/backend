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
 * remove expired email verification tokens
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
 * remove expired reset password tokens
 * @async
 * @method
 */
const deleteExpiredResetPasswordTokens = async () => {
    const expiredVerificationTokens = await prisma.user.updateMany({
        where: {
            ResetTokenCreatedAt: {
                lte: new Date(
                    Date.now() -
                        process.env.REST_PASS_EXPIRES_IN_HOURS * 60 * 60 * 1000
                ),
            },
        },
        data: {
            ResetTokenCreatedAt: null,
            ResetToken: null,
        },
    });
    return expiredVerificationTokens;
};

/**
 * remove soft deleted data
 * @async
 * @method
 */
const deleteSoftData = async () => {
    const models = ['Trends', 'Interactions', 'User'];
    let affectedRows = 0;
    for (const table of models) {
        const query = `
        DELETE FROM ${table}
        WHERE
            DeletedDate IS NOT NULL 
            AND DeletedDate < NOW() - INTERVAL ${process.env.RMV_SOFT_DATA_IN_DAYS} DAY`;

        affectedRows += await prisma.$executeRawUnsafe(query);
    }
    return affectedRows;
};

export default {
    deleteExpiredBlockedTokens,
    deleteExpiredVerificationTokens,
    deleteExpiredResetPasswordTokens,
    deleteSoftData,
};
