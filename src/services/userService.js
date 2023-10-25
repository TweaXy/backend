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
            email,
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
const CreateNewUser = async (email, username, name,birthdayDate, password,avatar) => {
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
            id
        },
        data: {
            tokens: {
                 id: createdToken.id ,
            },
        },
    });
};

export default { GetAllUsers, GetUserByEmail, GetUserById, CreateNewUser, AddToken };
