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
const getFirebaseToken=async()=>{

} ;
export default {
    getAllNotificationsCount,
    getUnseenNotificationsCount,
    addFollowNotificationDB,
    getFirebaseToken,
};
