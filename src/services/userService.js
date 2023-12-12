import prisma from '../prisma.js';

/**
 * @namespace Service.Users
 */

/**
 * Gets all details of a user by their ID.
 *
 * @memberof Service.Users
 * @method getUserAllDetailsById
 * @async
 * @param {String} id - User ID.
 * @returns {Promise<User|null>} A promise that resolves to the user object if found, otherwise null.
 */
const getUserAllDetailsById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
};

/**
 * Gets the count of users with the same email or username.
 *
 * @memberof Service.Users
 * @method getUsersCountByEmailUsername
 * @async
 * @param {String} email - User email.
 * @param {String} username - User username.
 * @returns {Promise<number>} A promise that resolves to the count of users with the same email or username.
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
 * Retrieves a user by their email.
 *
 * @memberof Service.Users
 * @method getUserByEmail
 * @async
 * @param {String} email - User email.
 * @returns {Promise<User|null>} A promise that resolves to the user object if found, otherwise null.
 */
const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
};

/**
 * Retrieves a user by their username.
 *
 * @memberof Service.Users
 * @method getUserByUsername
 * @async
 * @param {String} username - User username.
 * @returns {Promise<User|null>} A promise that resolves to the user object if found, otherwise null.
 */
const getUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
};

/**
 * Retrieves user details by ID.
 *
 * @memberof Service.Users
 * @method getUserById
 * @async
 * @param {String} id - User ID.
 * @returns {Promise<User|null>} A promise that resolves to the user details if found, otherwise null.
 */

const getUserById = async (id, curr_user_id) => {
    const userData = await prisma.user.findFirst({
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
            followedBy: {
                select: {
                    userID: true,
                },
                where: {
                    userID: curr_user_id,
                },
            },
            following: {
                select: {
                    followingUserID: true,
                },
                where: {
                    followingUserID: curr_user_id,
                },
            },
        },
    });
    if (!userData) return null;

    userData.followedByMe = userData?.followedBy?.length > 0;
    userData.followsMe = userData?.following?.length > 0;
    delete userData?.followedBy;
    delete userData?.following;
    return userData;
};

/**
 * Checks if a user with a given email already exists.
 *
 * @memberof Service.Users
 * @method checkUserEmailExists
 * @async
 * @param {String} email - User email.
 * @returns {Promise<number>} A promise that resolves to 0 if no user is found, or 1 if a user is found.
 */
const checkUserEmailExists = async (email) => {
    return await prisma.user.count({
        where: {
            email: email,
        },
    });
};

/**
 * Creates a new user.
 *
 * @memberof Service.Users
 * @method createNewUser
 * @async
 * @param {String} email - User email.
 * @param {String} username - User username.
 * @param {String} name - User name.
 * @param {Date} birthdayDate - User birthday date.
 * @param {String} password - User password.
 * @param {Buffer} avatar - User avatar.
 * @returns {Promise<User>} A promise that resolves to the newly created user object.
 * @throws {Error} Throws an error if the user creation fails.
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

/**
 * Retrieves user by email, username, or phone.
 *
 * @memberof Service.Users
 * @method getUserByUUID
 * @async
 * @param {String} UUID - User email, username, or phone.
 * @param {Object} selectionFilter - fields to select from the user object.
 * @returns {Promise<User|null>} A promise that resolves to the user object if found, otherwise null.
 */
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

/**
 * Retrieves basic user information by email, username, or phone.
 *
 * @memberof Service.Users
 * @method getUserBasicInfoByUUID
 * @async
 * @param {String} UUID - User email, username, or phone.
 * @returns {Promise<User|null>} A promise that resolves to basic user information if found, otherwise null.
 */

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

/**
 * Retrieves basic user information by ID.
 *
 * @memberof Service.Users
 * @method getUserBasicInfoById
 * @async
 * @param {String} id - User ID.
 * @returns {Promise<{{name, username, avatar, bio}}|null>} A promise that resolves to basic user information if found, otherwise null.
 */
const getUserBasicInfoById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
        },
    });

    return user;
};

/**
 * Updates user password by ID.
 *
 * @memberof Service.Users
 * @method updateUserPasswordById
 * @async
 * @param {String} id - User ID.
 * @param {String} password - New password.
 * @returns {Promise<Object>} A promise that resolves once the password is updated.
 * @throws {Error} Throws an error if the password update fails.
 */
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
 * Gets the hashed password of a user by ID.
 *
 * @memberof Service.Users
 * @method getUserPassword
 * @async
 * @param {String} id - User ID.
 * @returns {Promise<string|null>} A promise that resolves to the hashed password if found, otherwise null.
 */
const getUserPassword = async (id) => {
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        },
        select: {
            password: true,
        },
    });
    return user.password;
};

/**
 * Checks if a user follows another user.
 *
 * @memberof Service.Users
 * @method checkFollow
 * @async
 * @param {String} followerId - Follower User ID.
 * @param {String} followingId - Following User ID.
 * @returns {Promise<boolean>} A promise that resolves to true if the user follows another user, otherwise false.
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
    if (follow) return true;
    else return false;
};

/**
 * User follows another user.
 *
 * @memberof Service.Users
 * @method follow
 * @async
 * @param {String} followerId - Follower User ID.
 * @param {String} followingId - Following User ID.
 * @returns {Promise<void>} A promise that resolves once the follow relationship is established.
 * @throws {Error} Throws an error if the follow relationship fails.
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
 * User unfollows another user.
 *
 * @memberof Service.Users
 * @method unfollow
 * @async
 * @param {String} followerId - Follower User ID.
 * @param {String} followingId - Following User ID.
 * @returns {Promise<void>} A promise that resolves once the follow relationship is removed.
 * @throws {Error} Throws an error if the unfollow relationship fails.
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
 * Gets the count of a user's followers and followings.
 *
 * @memberof Service.Users
 * @method getUserFollowersFollwoingCount
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<{followedBy: number, following: number}>} A promise that resolves to an object containing the counts of followers and followings.
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
 * Deletes the profile cover (banner) of a user.
 *
 * @memberof Service.Users
 * @method deleteProfileBanner
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<void>} A promise that resolves once the profile cover is deleted.
 * @throws {Error} Throws an error if the profile cover deletion fails.
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
 * Deletes the profile avatar (picture) of a user.
 *
 * @memberof Service.Users
 * @method deleteProfilePicture
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<void>} A promise that resolves once the profile picture is deleted.
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

/**
 * Updates the user profile.
 *
 * @memberof Service.Users
 * @method updateProfile
 * @async
 * @param {Object} data - Updated user data.
 * @param {String} userID - User ID.
 * @returns {Promise<void>} A promise that resolves once the user profile is updated.
 * @throws {Error} Throws an error if the user profile update fails.
 */
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

/**
 * Updates user password by ID.
 *
 * @memberof Service.Users
 * @method updateUserEmailById
 * @async
 * @param {String} id - User ID.
 * @param {email} email - New password.
 * @returns {Promise<Object>} A promise that resolves once the password is updated.
 * @throws {Error} Throws an error if the password update fails.
 */
const updateUserEmailById = async (id, email) => {
    return await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            email,
        },
    });
};

/**
 * Checks if a user blocks another user.
 *
 * @memberof Service.Users
 * @method checkBlock
 * @async
 * @param {String} blockerId - Blocker User ID.
 * @param {String} blockedId - Blocked User ID.
 * @returns {Promise<boolean>} A promise that resolves to true if the user blocks another user, otherwise false.
 */
const checkBlock = async (blockerId, blockedId) => {
    const block = await prisma.blocks.findUnique({
        where: {
            userID_blockingUserID: {
                userID: blockerId,
                blockingUserID: blockedId,
            },
        },
    });
    if (block) return true;
    else return false;
};

/**
 * User blocks another user.
 *
 * @memberof Service.Users
 * @method block
 * @async
 * @param {String} blockerId - Blocker User ID.
 * @param {String} blockedId - Blocked User ID.
 * @returns {Promise<void>} A promise that resolves once the block relationship is established.
 * @throws {Error} Throws an error if the block relationship fails.
 */
const block = async (blockerId, blockedId) => {
    await prisma.$transaction([
        prisma.follow.deleteMany({
            where: {
                OR: [
                    { userID: blockerId, followingUserID: blockedId },
                    { userID: blockedId, followingUserID: blockerId },
                ],
            },
        }),
        prisma.blocks.create({
            data: {
                userID: blockerId,
                blockingUserID: blockedId,
            },
        }),
    ]);
};

/**
 * User unblocks another user.
 *
 * @memberof Service.Users
 * @method unblock
 * @async
 * @param {String} blockerId - Blocker User ID.
 * @param {String} blockedId - Blocked User ID.
 * @returns {Promise<void>} A promise that resolves once the unblock relationship is established.
 * @throws {Error} Throws an error if the unblock relationship fails.
 */
const unblock = async (blockerId, blockedId) => {
    await prisma.blocks.delete({
        where: {
            userID_blockingUserID: {
                userID: blockerId,
                blockingUserID: blockedId,
            },
        },
    });
};

export default {
    getUserAllDetailsById,
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
    updateUserEmailById,
    checkBlock,
    block,
    unblock,
};
