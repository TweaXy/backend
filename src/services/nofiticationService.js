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

export default {
    getAllNotificationsCount,
    getUnseenNotificationsCount,
};
