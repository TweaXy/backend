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
const addToken = async (id, token) => {

    const createdToken = await prisma.tokens.create({
        data: {
            userID: id,
            token,
        },
    });

    await prisma.user.update({
        where: {
            id
        },
        data: {
            tokens: {
                     id: createdToken.id ,
            },
        },
});
};


/**
 * Retrieves user by email .
 * @async
 * @method
 * @param {String} email- User email
 * * @param {String} password- User password
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const FindUserByEmail = async (email,password) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
            password:password,
        },
    });
};



/**
 * Retrieves user by email .
 * @async
 * @method
 * @param {number} phone- User phone number
 * * @param {String} password- User password
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const FindUserByPhone = async (phone,password) => {
    return await prisma.user.findFirst({
        where: {
            phone: phone,
            password:password,
        },
    });
};



/**
 * Retrieves user by email .
 * @async
 * @method
 * @param {String} username- Username
 * * @param {String} password- User password
 * @returns {User} User object
 * @throws {NotFoundError} When the user is not found.
 */
const FindUserByUsername = async (username,password) => {
    return await prisma.user.findUnique({
        where: {
            username: username,
            password:password,
        },
    });
};

export default { GetAllUsers, GetUserByEmail, GetUserById ,addToken,FindUserByEmail,FindUserByPhone,FindUserByUsername};
