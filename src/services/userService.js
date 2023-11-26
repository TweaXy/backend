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
            id,
        },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
            cover: true,
            phone: true,
            birthdayDate: true,
            joinedDate: true,
            bio: true,
            website: true,
            location: true,
            _count: {
                select: {
                    followedBy: true,
                    following: true,
                },
            },
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
            id: true,
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

const getUserBasicInfoById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            name: true,
            username: true,
            avatar: true,
            bio: true,
        },
    });

    return user;
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

/**

 * checks if user follows another user .
 * @async
 * @method
 * @param {String} followerId - Follower User id
 * @param {String} followingId - Following User id
 * @returns {Boolean} 
 * @throws {}
 */
const checkFollow = async (followerId, followingId) => {
    const follow = await prisma.follow.findUnique({
        where: {
            userID_followingUserID: {
                userID: followerId,
                followingUserID: followingId,
            },
        },
    });

    return follow;
};

/**
 * user follows another user .
 * @async
 * @method
 * @param {String} followerId - Follower User id
 * @param {String} followingId - Following User id
 * @throws {}
 */
const follow = async (followerId, followingId) => {
    await prisma.follow.create({
        data: {
            userID: followerId,
            followingUserID: followingId,
        },
    });
};

/**
 * user unfollows another user .
 * @async
 * @method
 * @param {String} followerId - Follower User id
 * @param {String} followingId - Following User id
 * @throws {}
 */
const unfollow = async (followerId, followingId) => {
    await prisma.follow.delete({
        where: {
            userID_followingUserID: {
                userID: followerId,
                followingUserID: followingId,
            },
        },
    });
};

/**
 * gets count of a user followers and followings  .
 * @async
 * @method
 * @param {String} userID - User id
 * @returns {{followedBy: Number, following: Number}} following and followers count
 */
const getUserFollowersFollwoingCount = async (userID) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userID,
        },
        select: {
            _count: {
                select: {
                    followedBy: true,
                    following: true,
                },
            },
        },
    });
    return user._count;
};

/**
 * delete profile cover(Banner)
 * @async
 * @method
 * @param {String} userID - User id
 * @returns {}
 */
const deleteProfileBanner = async (userID) => {
    await prisma.user.update({
        where: {
            id: userID,
        },
        data: {
            cover: null,
        },
    });
};

/**
 * delete profile avatar(picture)
 * @async
 * @method
 * @param {String} userID - User id
 * @returns {}
 */
const deleteProfilePicture = async (userID) => {
    await prisma.user.update({
        where: {
            id: userID,
        },
        data: {
            avatar: 'uploads/default.png',
        },
    });
};

const updateProfile = async (data, userID) => {
    if (data.birthdayDate)
        data.birthdayDate = new Date(data.birthdayDate).toISOString();

    await prisma.user.update({
        where: {
            id: userID,
        },
        data,
    });
};

export default {
    getUserByEmail,
    getUserByUsername,
    getUserById,
    checkUserEmailExists,
    getUserBasicInfoByUUID,
    getUserBasicInfoById,
    getUserByUUID,
    createNewUser,
    updateUserPasswordById,
    getUsersCountByEmailUsername,
    getUserPassword,
    checkFollow,
    follow,
    unfollow,
    getUserFollowersFollwoingCount,
    deleteProfileBanner,
    deleteProfilePicture,
    updateProfile,
};
