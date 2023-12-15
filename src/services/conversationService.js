import prisma from '../prisma.js';

/**
 * @namespace Service.Converations
 */

/**
 * return schema to get user conversation
 *
 * @memberof Service.Conversations
 * @method getUserConversationsSchema
 * @async
 * @param {String} userID - User ID.
 * @returns {Object} A schema to call in prisma to fetch user conversations.
 */
const getUserConversationsSchema = (userID) => {
    return {
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
            id: true,
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
                            receiverId: userID,
                        },
                    },
                },
            },
        },
        orderBy: {
            lastUpdatedMessage: 'desc',
        },
    };
};

/**
 * map user conversations with more readable way.
 *
 * @memberof Service.Conversations
 * @method mapUserConversations
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<Array>} A promise that resolves to an array of user conversations with the count of unseen messages.
 */
const mapUserConversations = (fetchedConversations) => {
    return fetchedConversations.map((r) => {
        const lastMessage = r.DirectMessages[0] ?? null;
        const { _count, DirectMessages, ...ret } = r;
        return { ...ret, unseenCount: r._count.DirectMessages, lastMessage };
    });
};

/**
 * add conversation between users
 *
 * @memberof Service.Conversations
 * @method checkConversationExistUsingUsers
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<Number>} A promise that resolves to count of conversation of user1 and user2.
 */
const checkConversationExistUsingUsers = async (user1ID, user2ID) => {
    const count = await prisma.conversations.count({
        where: {
            OR: [
                {
                    user1ID: user1ID,
                    user2ID: user2ID,
                },
                {
                    user1ID: user2ID,
                    user2ID: user1ID,
                },
            ],
        },
    });
    return count !== 0;
};

/**
 * add conversation between users
 *
 * @memberof Service.Conversations
 * @method createCoversation
 * @async
 * @param {String} userID - User ID.
 * @returns {Promise<Object>} A promise that resolves to object of new conversation.
 */
const createCoversation = async (user1ID, user2ID) => {
    return await prisma.conversations.create({
        data: {
            user1ID: user1ID,
            user2ID: user2ID,
        },
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

/**
 * Gets messages for a specific conversation, including user details for each participant.
 *
 * @memberof Service.Conversations
 * @method addConversationMessage
 * @async
 * @param {String} conversationID - Conversation ID.
 * @returns {Promise<Object>} A promise that resolves to an object of created message.
 */

const addConversationMessage = async (
    conversationID,
    senderID,
    recieverID,
    text,
    files = []
) => {
    const message = await prisma.directMessages.create({
        data: {
            conversationID: conversationID,
            senderId: senderID,
            receiverId: recieverID,
            text: text,
        },
    });

    await prisma.conversations.update({
        data: {
            lastUpdatedMessage: new Date(Date.now()).toISOString(),
        },
        where: {
            id: conversationID,
        },
    });

    return message;
};

/**
 * Gets messages for a specific conversation, including user details for each participant.
 *
 * @memberof Service.Conversations
 * @method checkUserConversationExist
 * @async
 * @param {String} conversationID - Conversation ID.
 * @returns {Promise<Boolean>} A promise that resolves to true if user have conversation with this id.
 */

const getUserConversation = async (conversationID, userID) => {
    return await prisma.conversations.findFirst({
        where: {
            id: conversationID,
            OR: [
                {
                    user1ID: userID,
                },
                {
                    user2ID: userID,
                },
            ],
        },
    });
};

export default {
    getUserConversationsSchema,
    mapUserConversations,
    checkConversationExistUsingUsers,
    createCoversation,
    getCovnersationMessages,
    setSeenMessages,
    addConversationMessage,
    getUserConversation,
};
