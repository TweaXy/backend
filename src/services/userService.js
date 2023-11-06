import prisma from '../prisma.js';

/**
 * get count of users have same email or username
 * @async
 * @method
 * @param {String} email - User email
 * @param {String} username - User username
 * @returns {User} User object
 */
const getUsersCountByEmailUsername = async (email, username) => {
    return await prisma.user.count({
        where: {
            OR: [
                {
                    email: email,
                },
                {
                    username: username,
                },
            ],
        },
    });
};

/**
 * Retrieves user by email .
 * @async
 * @method
 * @param {String} email - User email
 * @returns {User} User object
 */
const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
};

/**
 * Retrieves user by username .
 * @async
 * @method
 * @param {String} username - User username
 * @returns {User} User object
 */
const getUserByUsername = async (username) => {
    return await prisma.user.findFirst({
        where: {
            username: username,
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
            birthdayDate: new Date(birthdayDate).toISOString(),
            password,
            avatar,
        },
        select: {
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
        },
    });
};

const getUserByUUID = async (UUID, selectionFilter = {}) => {
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
        select: { ...selectionFilter },
    });
    return user;
};

const getUserBasicInfoByUUID = async (UUID) => {
    const userBasicFields = {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
    };

    return await getUserByUUID(UUID, userBasicFields);
};

const updateUserPasswordById = async (id, password) => {
    return await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            password: password,
            ResetToken: null,
            ResetTokenCreatedAt: null,
        },
    });
};

/**
 * gets password of a user  .
 * @async
 * @method
 * @param {String} id - User id
 * @returns {string} User hashed password
 * @throws {}
 */
const getUserPassword = async (id) => {
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        },
    });
    return user.password;
};

export default {
    getUserByEmail,
    getUserByUsername,
    getUserById,
    checkUserEmailExists,
    getUserBasicInfoByUUID,
    getUserByUUID,
    createNewUser,
    updateUserPasswordById,
    getUsersCountByEmailUsername,
    getUserPassword,
};
