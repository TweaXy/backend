import prisma from '../prisma.js';
/**
 * gets user converations of a user  .
 * @async
 * @method
 * @param {String} userID - User id
 * @returns {{followedBy: Number, following: Number}} following and followers count
 */
const getUserConversations = async (userID) => {
    const conversations = await prisma.conversations.findMany({
        where: {
            OR: [
                {
                    user1ID: userID,
                },
                {
                    user2ID: userID,
                },
            ],
        },
        select: {
            _count: {
                select: {
                    DirectMessages: {
                        where: {
                            seen: false,
                        },
                    },
                },
            },
        },
    });
    return conversations;
};
export default {
    getUserConversations,
};
