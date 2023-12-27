import prisma from '../prisma.js';

/**
 * @namespace Service.Notifications
 */

/**
 * Retrieves the count of unseen notifications for a user.
 *
 * @memberof Service.Notifications
 * @method getUnseenNotificationsCount
 * @async
 * @param {Object} schema - Query schema for fetching notifications.
 * @returns {Promise<number[]>} A promise resolving to an array of unseen notifications.
 */
const getUnseenNotificationsCount = async (schema) => {
    const items = await prisma.notifications.findMany({
        ...schema,
    });
    return items;
};

/**
 * Retrieves the total count of notifications for a user.
 *
 * @memberof Service.Notifications
 * @method getAllNotificationsCount
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<number>} A promise resolving to the total count of notifications.
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
 * @async
 * @param {String} followerID - ID of the user initiating the follow action.
 * @param {String} followedID - ID of the user being followed.
 * @throws {Error} If there's an issue creating the follow notification.
 */
const addFollowNotificationDB = async (followerID, followedID) => {
    await prisma.notifications.create({
        data: {
            action: 'FOLLOW',
            seen: false,
            userID: followedID,
            fromUserID: followerID,
        },
    });
};

/**
 * Adds a Like notification to the database.
 *
 * @memberof Service.Notifications
 * @async
 * @param {String} userID - ID of the user who liked the interaction.
 * @param {Object} interaction - The interaction object representing the Like action.
 * @throws {Error} If there's an issue creating the Like notification.
 */
const addLikeNotificationDB = async (userID, interaction) => {
    await prisma.notifications.create({
        data: {
            action: 'LIKE',
            seen: false,
            userID: interaction.user.id,
            fromUserID: userID,
            interactionID: interaction.id,
        },
    });
};
/**
 * Adds a Reply notification to the database.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string} fromUserID - The ID of the user who replied to the interaction.
 * @param {Object} interaction - The interaction object representing the reply action.
 * @param {string} userID - The ID of the user receiving the notification.
 * @throws {Error} If there is an issue creating the reply notification in the database.
 */
const addReplyNotificationDB = async (fromUserID, interaction, userID) => {
    await prisma.notifications.create({
        data: {
            action: 'REPLY',
            seen: false,
            userID: userID,
            fromUserID: fromUserID,
            interactionID: interaction.id,
        },
    });
};

/**
 * Adds a device token to the database for push notifications.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string} id - The user ID associated with the token.
 * @param {string} token - The device token for push notifications.
 * @param {string} type - The type of device (e.g., 'W' for web, 'A' for Android).
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

/**
 * Checks if a given token exists in the database.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string} token - The device token for push notifications.
 * @param {string} type - The type of device (e.g., 'A' for Android, 'W' for web).
 * @returns {Promise<Object | null>} A promise that resolves to the token record if found, otherwise null.
 */
const checkTokens = async (token, type) => {
    let tokens = null;
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
    console.log(tokens);
    return tokens;
};
/**
 * Gets Firebase tokens for a given list of user IDs.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string[]} userIds - An array of user IDs.
 * @param {string} type - The type of device (e.g., 'W' for web, 'A' for Android).
 * @returns {Promise<string[]>} A promise that resolves to an array of Firebase tokens.
 */
const getFirebaseToken = async (userIds, type) => {
    if (type == 'W') {
        const res = await prisma.webTokens.findMany({
            where: {
                userID: {
                    in: userIds,
                },
            },
            select: {
                token: true,
            },
        });

        return res.map((item) => item.token);
    }
    const res = await prisma.andoridTokens.findMany({
        where: {
            userID: {
                in: userIds,
            },
        },
        select: {
            token: true,
        },
    });
    return res.map((item) => item.token);
};
/**
 * Adds mention notifications to the database for multiple users.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string} userID - The ID of the user mentioning others.
 * @param {Object} interaction - The interaction object representing the mention action.
 * @param {string[]} mentionIds - An array of user IDs being mentioned.
 * @throws {Error} If there is an issue creating mention notifications in the database.
 */
const addMentionNotificationDB = async (userID, interaction, mentionIds) => {
    const notificationsData = mentionIds.map((userId) => ({
        action: 'MENTION',
        seen: false,
        userID: userId,
        fromUserID: userID,
        interactionID: interaction.id,
    }));

    // Using createMany to insert multiple rows at once
    await prisma.notifications.createMany({
        data: notificationsData,
    });
};
/**
 * Updates the 'seen' status of multiple notifications for a specific user.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string} userID - The ID of the user for whom notifications should be marked as seen.
 * @throws {Error} If there is an issue updating the 'seen' status in the database.
 */
const updateSeen = async (userID) => {
    await prisma.notifications.updateMany({
        where: {
            userID: userID,
        },
        data: {
            seen: true,
        },
    });
};

/**
 * Adds a Retweet notification to the database for a specific user.
 *
 * @memberof Service.Notifications
 * @async
 * @param {string} userID - The ID of the user initiating the Retweet action.
 * @param {Object} interaction - The interaction object representing the Retweet action.
 * @throws {Error} If there is an issue creating the Retweet notification in the database.
 */

const addRetweetNotificationDB = async (userID, interaction) => {
    await prisma.notifications.create({
        data: {
            action: 'RETWEET',
            seen: false,
            userID: interaction.user.id,
            fromUserID: userID,
            interactionID: interaction.id,
        },
    });
};

/**
 * Checks the existence of a token in the database based on its type.
 *
 * @memberof Service.Notifications
 * @function checkStatus
 * @async
 * @param {string} token - The token to check.
 * @param {string} type - The type of token ('android' or 'web').
 * @returns {Promise<boolean>} - A promise that resolves to true if the token exists for the specified type, otherwise false.
 * @description Queries the database to verify if a token of a certain type exists.
 * @throws {Error} If there's an issue querying the database for the token.
 */
const checkStatus = async (token, type) => {
    let tokens = null;
    if (type == 'android') {
        tokens = await prisma.andoridTokens.findFirst({
            where: { token: token },
        });
    } else if (type == 'web') {
        tokens = await prisma.webTokens.findFirst({ where: { token: token } });
    }
    if (tokens == null) return false;
    return true;
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
    updateSeen,
    addRetweetNotificationDB,
    checkStatus,
};
