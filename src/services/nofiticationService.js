import prisma from '../prisma.js';

/**
 * @namespace Service.Notifications
 */

/**
 * Gets the count of unseen notifications for a user.
 *
 * @memberof Service.Notifications
 * @method getUnseenNotificationsCount
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<number>} A promise that resolves to the count of unseen notifications for the user.
 */
const getUnseenNotificationsCount = async (userID) => {
    const user = await prisma.user.findFirst({
        where: {
            userID,
        },
        select: {
            _count: {
                select: {
                    notificationsTOMe: {
                        where: {
                            seen: false,
                        },
                    },
                },
            },
        },
    });
    return user._count.notificationsTOMe;
};

/**
 * Gets the total count of notifications for a user.
 *
 * @memberof Service.Notifications
 * @method getAllNotificationsCount
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<number>} A promise that resolves to the total count of notifications for the user.
 */
const getAllNotificationsCount = async (userID) => {
    const user = await prisma.user.findFirst({
        where: {
            userID,
        },
        select: {
            _count: {
                select: {
                    notificationsTOMe: true,
                },
            },
        },
    });
    return user._count.notificationsTOMe;
};
/**
 * Adds a follow notification to the database.
 *
 * @memberof Service.Notifications
 * @method addFollowNotificationDB
 * @async
 * @param {Object} follower - The user initiating the follow action.
 * @param {Object} followed -  The user being followed.
 * @returns {Promise<void>} A promise that resolves when the follow notification is successfully added to the database.
 * @throws {Error} If there is an issue creating the follow notification in the database.
 */
const addFollowNotificationDB = async (follower, followed) => {
    await prisma.notifications.create({
        data: {
            action: 'FOLLOW',
            seen: false,
            userID: followed.id,
            fromUserID: follower.id,
        },
    });
};

/**
 * Adds a Like notification to the database.
 *
 * @memberof Service.Notifications
 * @method addLikeNotificationDB
 * @async
 * @param {Object} user - The user who liked the interaction.
 * @param {Object} interaction - The interaction object representing the Like action.
 * @returns {Promise<void>} A promise that resolves when the Like notification is successfully added to the database.
 * @throws {Error} If there is an issue creating the Like notification in the database.
 */
const addLikeNotificationDB = async (user, interaction) => {
    await prisma.notifications.create({
        data: {
            action: 'LIKE',
            seen: false,
            userID: interaction.user.id,
            fromUserID: user.id,
            interactionID: interaction.id,
        },
    });
};

/**
 * Adds a Reply notification to the database.
 *
 * @memberof Service.Notifications
 * @method addLikeNotificationDB
 * @async
 * @param {Object} user - The user whoreplied to the interaction.
 * @param {Object} interaction - The interaction object representing the reply action.
 * @returns {Promise<void>} A promise that resolves when the reply notification is successfully added to the database.
 * @throws {Error} If there is an issue creating the Like notification in the database.
 */
const addReplyNotificationDB = async (user, interaction) => {
    await prisma.notifications.create({
        data: {
            action: 'REPLY',
            seen: false,
            userID: interaction.user.id,
            fromUserID: user.id,
            interactionID: interaction.id,
        },
    });
};

/**
 * Adds a device token to the database for push notifications.
 *
 * @memberof Service.Notifications
 * @method addToken
 * @async
 * @param {string} id - The user ID associated with the token.
 * @param {string} token - The device token for push notifications.
 * @param {string} type - The type of device (e.g., 'A' for Android, 'I' for iOS).
 * @returns {Promise<void>} A promise that resolves when the token is successfully added to the database.
 * @throws {Error} If there is an issue creating the token in the database.
 */
const addToken = async (id, token, type) => {
    if (type == 'W') {
        await prisma.webTokens.create({
            data: {
                userID: id,
                token: token,
            },
        });
    } else {
        await prisma.andoridTokens.create({
            data: {
                userID: id,
                token: token,
            },
        });
    }
};
const checkTokens = async (token, type) => {
    let tokens;
    if (type == 'A')
        tokens = await prisma.andoridTokens.findFirst({
            where: {
                token: token,
            },
        });
    else
        tokens = await prisma.webTokens.findFirst({
            where: {
                token: token,
            },
        });
    return tokens;
};

const getFirebaseToken = async (userIds, type) => {
    if (type == 'w')
        return await prisma.webTokens.findMany({
            where: {
                userID: {
                    in: userIds,
                },
            },
            select: {
                token: true,
            },
        });
    else
        return await prisma.andoridTokens.findMany({
            where: {
                userID: {
                    in: userIds,
                },
            },
            select: {
                token: true,
            },
        });
};

const addMentionNotificationDB = async (user, interaction, mentionIds) => {
    const notificationsData = mentionIds.map((userId) => ({
        action: 'MENTION',
        seen: false,
        userID: userId,
        fromUserID: user.id,
        interactionID: interaction.id,
    }));

    // Using createMany to insert multiple rows at once
    await prisma.notifications.createMany({
        data: notificationsData,
    });
};
export default {
    getAllNotificationsCount,
    getUnseenNotificationsCount,
    addFollowNotificationDB,
    addLikeNotificationDB,
    getFirebaseToken,
    addToken,
    checkTokens,
    addReplyNotificationDB,
    addMentionNotificationDB,
};
