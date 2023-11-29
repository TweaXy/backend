import prisma from '../prisma.js';

/**
 * @namespace emailVerificationToken
 * @memberof Service.Auth
 */

/**
 * Gets the email verification token for a given email.
 *
 * @memberof Service.Auth.emailVerificationToken
 * @method getEmailVerificationToken
 * @async
 * @param {String} email - The email for which to retrieve the verification token.
 * @returns {Promise<Object|null>} A promise that resolves to the email verification token or null if not found.
 */
const getEmailVerificationToken = async (email) => {
    return await prisma.emailVerificationToken.findUnique({
        where: {
            email: email,
        },
    });
};

/**
 * Creates a new email verification token for the specified email and token.
 *
 * @memberof Service.Auth.emailVerificationToken
 * @method createEmailVerificationToken
 * @async
 * @param {String} email - The email for which to create the verification token.
 * @param {String} token - The verification token to be associated with the email.
 * @returns {Promise<Object>} A promise that resolves to the created email verification token.
 */
const createEmailVerificationToken = async (email, token) => {
    return await prisma.emailVerificationToken.create({
        data: {
            email: email,
            token: token,
        },
    });
};

/**
 * Updates the email verification token for a given email.
 *
 * @memberof Service.Auth.emailVerificationToken
 * @method updateEmailVerificationToken
 * @async
 * @param {String} email - The email for which to update the verification token.
 * @param {String} token - The new verification token.
 * @returns {Promise<Object>} A promise that resolves to the updated email verification token.
 */
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

/**
 * Deletes the email verification token for a given email.
 *
 * @memberof Service.Auth.emailVerificationToken
 * @method deleteEmailVerificationToken
 * @async
 * @param {String} email - The email for which to delete the verification token.
 * @returns {Promise<Object>} A promise that resolves to the deleted email verification token.
 */
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
