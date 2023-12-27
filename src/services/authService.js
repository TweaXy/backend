import prisma from '../prisma.js';
import jwt from 'jsonwebtoken';

/**
 * @namespace Service.Auth
 */

/**
 * Sets the user reset token in the database.
 *
 * @memberof Service.Auth
 * @function setUserResetToken
 * @async
 * @param {number} id - The user ID.
 * @param {string} token - The reset token to be set.
 * @returns {Promise<{ id: number }>} A promise that resolves to the updated user's ID.
 * @description Sets the reset token for a user in the database with the given user ID.
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
 * @function addTokenToBlacklist
 * @async
 * @param {string} token - The token to be added to the blacklist.
 * @returns {Promise<void>} A promise that resolves when the token is added to the blacklist.
 * @description Adds a given token to the blacklist to invalidate it for future use.
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
 * @function checkIfTokenIsBlacklisted
 * @async
 * @param {string} token - The token to be checked.
 * @returns {Promise<Object|null>} A promise that resolves to the blacklisted token's details or null if not blacklisted.
 * @description Checks if a given token exists in the blacklist.
 */
const checkIfTokenIsBlacklisted = async (token) => {
    return await prisma.blockedTokens.findUnique({
        where: {
            token,
        },
    });
};
/**
 * Removes a device token from the database based on the token and type.
 *
 * @memberof Service.Auth
 * @function removeDeviceToken
 * @async
 * @param {string} token - The token to be removed.
 * @param {string} type - The type of device (e.g., 'android', 'web').
 * @returns {Promise<Object>} A promise that resolves to the deleted device token details.
 * @description Removes the device token from the corresponding table (androidTokens or webTokens) based on the provided type.
 */
const removeDeviceToken = async (token, type) => {
    if (type == 'android') {
        return await prisma.andoridTokens.deleteMany({
            where: { token: token },
        });
    } else if (type == 'web') {
        return await prisma.webTokens.deleteMany({ where: { token: token } });
    }
};
export {
    setUserResetToken,
    addTokenToBlacklist,
    checkIfTokenIsBlacklisted,
    removeDeviceToken,
};
