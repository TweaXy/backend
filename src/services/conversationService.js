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
            OR: [{ user1ID: userID }, { user2ID: userID }],
        },
        select: {
            id: true,
            user1: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    _count: {
                        select: {
                            followedBy: true,
                            following: true,

                            blockedBy: { where: { userID: userID } },
                            blocking: { where: { blockingUserID: userID } },
                            mutedBy: { where: { userID: userID } },
                            muting: { where: { mutingUserID: userID } },
                        },
                    },
                },
            },
            user2: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    _count: {
                        select: {
                            followedBy: true,
                            following: true,
                            blockedBy: { where: { userID: userID } },
                            blocking: { where: { blockingUserID: userID } },
                            mutedBy: { where: { userID: userID } },
                            muting: { where: { mutingUserID: userID } },
                        },
                    },
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
const mapUserConversations = (fetchedConversations, userID) => {
    return fetchedConversations.map((r) => {
        if (!r) return null;
        const lastMessage = r.DirectMessages[0] ?? null;
        r = {
            ...r,
            user:
                userID === r.user1.id
                    ? mapConversationUsers(r.user2)
                    : mapConversationUsers(r.user1),
            lastMessage,
            unseenCount: r._count.DirectMessages,
        };
        const { _count, DirectMessages, user1, user2, ...ret } = r;
        return ret;
    });
};
const mapConversationUsers = (fetchedUser) => {
    if (!fetchedUser || !fetchedUser._count) return null;
    fetchedUser.isBlockedByMe = fetchedUser._count.blockedBy > 0;
    fetchedUser.isBlockingMe = fetchedUser._count.blocking > 0;
    fetchedUser.isMutedByMe = fetchedUser._count.mutedBy > 0;
    fetchedUser.isMutingMe = fetchedUser._count.muting > 0;

    delete fetchedUser._count.blockedBy;
    delete fetchedUser._count.blocking;
    delete fetchedUser._count.mutedBy;
    delete fetchedUser._count.muting;

    return fetchedUser;
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
const setSeenMessages = async (conversationID, userID) => {
    const updatedMessages = await prisma.directMessages.updateMany({
        where: {
            AND: [
                { conversationID: conversationID },
                { receiverId: userID },
                { seen: false },
            ],
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
 * @method getCovnersationMessagesSchema
 * @async
 * @param {String} conversationID - Conversation ID.
 * @returns {Promise<Object>} return object to schema of messages in the specified conversation.
 */
const getCovnersationMessagesSchema = (conversationID) => {
    return {
        where: {
            conversationID: conversationID,
        },
        select: {
            id: true,
            conversationID: true,
            text: true,
            seen: true,
            createdDate: true,
            senderId: true,
            receiverId: true,
            media: {
                select: {
                    fileName: true,
                },
            },
        },
        orderBy: {
            createdDate: 'desc',
        },
    };
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
    files
) => {
    const mediaRecords = files?.map((file) => {
        return { fileName: file.filename };
    });
    const message = await prisma.directMessages.create({
        data: {
            conversationID: conversationID,
            senderId: senderID,
            receiverId: recieverID,
            text: text,
            media: {
                create: mediaRecords,
            },
        },
        select: {
            id: true,
            conversationID: true,
            text: true,
            seen: true,
            createdDate: true,
            senderId: true,
            receiverId: true,
            media: {
                select: {
                    fileName: true,
                },
            },
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
 * @method getUserConversation
 * @async
 * @param {String} conversationID - Conversation ID.
 * @returns {Promise<Object>} A promise that resolves to true if user have conversation with this id.
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

/**
 * Gets messages for a specific conversation, including user details for each participant.
 *
 * @memberof Service.Conversations
 * @method getUnseenConversationsCount
 * @async
 * @param {String} conversationID - Conversation ID.
 * @returns {Promise<Object>} A promise that resolves to true if user have conversation with this id.
 */

const getUnseenConversationsCount = async (userID) => {
    return await prisma.conversations.count({
        where: {
            AND: [
                {
                    OR: [
                        {
                            user1ID: userID,
                        },
                        {
                            user2ID: userID,
                        },
                    ],
                },
                {
                    DirectMessages: {
                        some: {
                            seen: false,
                            receiverId: userID,
                        },
                    },
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
    getCovnersationMessagesSchema,
    setSeenMessages,
    addConversationMessage,
    getUserConversation,
    getUnseenConversationsCount,
};
