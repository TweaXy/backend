import prisma from '../prisma.js';
/**
 * Retrieves all user .
 * @async
 * @method
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const getAllUsers = async () => {
    return await prisma.user.findMany({
        include: {
            following: {
                select: {
                    name: true,
                    email: true,
                },
            },
            followedBy: true,
        },
    });
};
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
 * Retrieves user by id .
 * @async
 * @method
 * @param {Int} id - User email
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
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
    getAllUsers,
    getUserByEmail,
    getUserById,
    checkUserEmailExists,
    getUserByUUID,
};
