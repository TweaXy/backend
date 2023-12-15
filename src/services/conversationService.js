import prisma from '../prisma.js';

/**
 * @namespace Service.Converations
 */

/**
 * Gets user conversations and the count of unseen messages in those conversations.
 *
 * @memberof Service.Conversations
 * @method getUserConversations
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<Array>} A promise that resolves to an array of user conversations with the count of unseen messages.
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
            user1: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                },
            },
            user2: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                },
            },
            DirectMessages: {
                select: {
                    id: true,
                    text: true,
                    createdDate: true,
                    seen: true,
                    media: true,
                    sender: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
                take: 1,
                orderBy: {
                    createdDate: 'desc',
                },
            },
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
    return conversations.map((r) => {
        const { _count, ...ret } = r;
        return { ...ret, unseenCount: r._count.DirectMessages };
    });
};

/**
 * Sets the 'seen' status for a list of messages.
 *
 * @memberof Service.Conversations
 * @method setSeenMessages
 * @async
 * @param {Array} messages - An array of messages to be marked as 'seen'.
 * @returns {Promise<Array>} A promise that resolves to an array of updated messages.
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
 * Gets messages for a specific conversation, including user details for each participant.
 *
 * @memberof Service.Conversations
 * @method getCovnersationMessages
 * @async
 * @param {String} conversationID - Conversation ID.
 * @returns {Promise<Array>} A promise that resolves to an array of messages in the specified conversation.
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
