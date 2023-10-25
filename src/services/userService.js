import prisma from '../prisma.js';

/**
 * Retrieves user by email .
 * @async
 * @method
 * @param {String} email - User email
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const GetUserByEmail = async (email) => {
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

const deleteUserByIdAndToken = async (id, token) => {
    return await prisma.Tokens.delete({
        where: {
            userID: id,
            token,
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
const CreateNewUser = async (
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

export default {
    GetUserByEmail,
    checkUserEmailExists,
    deleteUserByIdAndToken,
    CreateNewUser,
    AddToken,
};
