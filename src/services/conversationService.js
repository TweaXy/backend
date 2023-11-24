import prisma from '../prisma.js';
/**
 * gets user converations of a user  and count of unseen messages in that conversaiotn .
 * @async
 * @method
 * @param {String} userID - User id
 * @returns {}
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

/**
 * gets user converations of a user  and count of unseen messages in that conversaiotn .
 * @async
 * @method
 * @param {Array} messages
 * @returns {}
 */

const setSeenMessages = async (messages) => {
    const messageIds = messages.map((message) => message.id);
    const updatedMessages = await prisma.directMessages.updateMany({
        where: {
            id: {
                in: messageIds,
            },
        },
        data: {
            seen: true,
        },
    });
    return updatedMessages;
};
/**
 * gets user converations of a user  and count of unseen messages in that conversaiotn .
 * @async
 * @method
 * @param {String} userID - User id
 * @returns {}
 */
const getCovnersationMessages = async (conversationID) => {
    const messages = await prisma.directMessages.findMany({
        where: {
            conversationID: conversationID,
        },
        select: {
            id: true,
            conversationID: true,
            text: true,
            seen: true,
            createdDate: true,
            conversation: {
                select: {
                    user1: {
                        select: {
                            username: true,
                            avatar: true,
                        },
                    },
                    user2: {
                        select: {
                            username: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });

    return messages;
};

export default {
    getUserConversations,
    getCovnersationMessages,
    setSeenMessages,
};
