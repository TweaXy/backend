import prisma from '../prisma.js';
/**
 * @namespace Service.ExpiredData
 */

/**
 * Removes expired blocked tokens.
 *
 * @memberof Service.ExpiredData
 * @method deleteExpiredBlockedTokens
 * @async
 * @returns {Promise<number>} A promise that resolves to the number of deleted expired blocked tokens.
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
 * Removes expired email verification tokens.
 *
 * @memberof Service.ExpiredData
 * @method deleteExpiredVerificationTokens
 * @async
 * @returns {Promise<number>} A promise that resolves to the number of deleted expired email verification tokens.
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
 * Removes expired reset password tokens.
 *
 * @memberof Service.ExpiredData
 * @method deleteExpiredResetPasswordTokens
 * @async
 * @returns {Promise<number>} A promise that resolves to the number of updated users with expired reset password tokens.
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
 * Removes soft deleted data from specified models.
 *
 * @memberof Service.ExpiredData
 * @method deleteSoftData
 * @async
 * @returns {Promise<number>} A promise that resolves to the total number of affected rows across all specified models.
 */
const deleteSoftData = async () => {
    const models = ['Interactions', 'User', 'DirectMessages'];
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
