import prisma from '../prisma.js';

/**
 * get count of nofitications that not seen of user
 * @async
 * @method
 * @param {String} id - User id
 * @returns {Int} count
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
 * get count of nofitications of user
 * @async
 * @method
 * @param {String} id - User id
 * @returns {Int} count
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
