import prisma from '../prisma.js';
import jwt from 'jsonwebtoken';

/**
 * @namespace Service.Auth
 */

/**
 * Sets the user reset token in the database.
 *
 * @memberof Service.Auth
 * @method setUserResetToken
 * @async
 * @param {number} id - The user ID.
 * @param {string} token - The reset token to be set.
 * @returns {Promise<{ id: number }>} A promise that resolves to the updated user's ID.
 */
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

/**
 * Adds a token to the blacklist in the database.
 *
 * @memberof Service.Auth
 * @method addTokenToBlacklist
 * @async
 * @param {string} token - The token to be added to the blacklist.
 * @returns {Promise<void>} A promise that resolves when the token is added to the blacklist.
 */
const addTokenToBlacklist = async (token) => {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    await prisma.blockedTokens.create({
        data: {
            token,
            expiredDate: new Date(decode.exp * 1000),
        },
    });
};

/**
 * Checks if a token is blacklisted in the database.
 *
 * @memberof Service.Auth
 * @method checkIfTokenIsBlacklisted
 * @async
 * @param {string} token - The token to be checked.
 * @returns {Promise<Object|null>} A promise that resolves to the blacklisted token's details or null if not blacklisted.
 */
const checkIfTokenIsBlacklisted = async (token) => {
    return await prisma.blockedTokens.findUnique({
        where: {
            token,
        },
    });
};
export { setUserResetToken, addTokenToBlacklist, checkIfTokenIsBlacklisted };
