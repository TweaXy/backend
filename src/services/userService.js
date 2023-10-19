import prisma from '../prisma.js';
/**
 * Retrieves all user .
 * @async
 * @method
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const GetAllUsers = async () => {
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
const GetUserByEmail = async (email) => {
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
const GetUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
};

export default { GetAllUsers, GetUserByEmail, GetUserById };
