import prisma from '../prisma.js';

/**
 * Retrieves user by email .
 * @async
 * @method
 * @param {String} email - User email
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
};

/**
 * delete TOken with userID and token .
 * @async
 * @method
 * @param {string} id - User id
 * @param {string} token - User token
 */

const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            userID: id,
        },
    });
};

/**
 * Retrieves count of users have same email .
 * @async
 * @method
 * @param {Int} email - user email
 * @returns {Int} 0 => no user found | 1 user is found
 */
const checkUserEmailExists = async (email) => {
    return await prisma.user.count({
        where: {
            email: email,
        },
    });
};

/**
 * Creates new user  .
 * @async
 * @method
 * @param {String} email - User email
 * @param {String} username - User username
 * @param {String} name - User name
 * @param {Date} birthdayDate  - User birthday date
 * @param {String} password - User password
 * @param {Buffer} avatar - User avatar
 * @returns {User} User object
 * @throws {}
 */
const createNewUser = async (
    email,
    username,
    name,
    birthdayDate,
    password,
    avatar
) => {
    return await prisma.user.create({
        data: {
            email,
            username,
            name,
            birthdayDate,
            password,
            avatar,
        },
    });
};
/**
 * Adds new token to a certin user  .
 * @async
 * @method
 * @param {String} id - User id
 * @param {String} token - User token
 * @returns {} nothing
 * @throws {}
 */
const AddToken = async (id, token) => {
    const createdToken = await prisma.tokens.create({
        data: {
            userID: id,
            token,
        },
    });

    await prisma.user.update({
        where: {
            id,
        },
        data: {
            tokens: {
                id: createdToken.id,
            },
        },
    });
};

const getUserByUUID = async (UUID) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    email: UUID,
                },
                {
                    username: UUID,
                },
                {
                    phone: UUID,
                },
            ],
        },
    });
    return user;
};

export default {
    getUserByEmail,
    getUserById,
    checkUserEmailExists,
    getUserByUUID,
    createNewUser,
    AddToken,
};
