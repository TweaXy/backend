import prisma from '../prisma.js';
/**
 * @namespace Service.Interactions
 * @memberof Service
 */

/**
 * Get statistics for a specific interaction, including likes, views, comments, and retweets.
 *
 * @async
 * @method
 * @memberof Service.Interactions
 * @param {number} interactionId - The ID of the interaction for which to fetch statistics.
 * @returns {Promise<{likes: number, views: number, comments: number, retweets: number}>} - A promise that resolves with the interaction statistics.
 */
const getInteractionStats = async (interactionId) => {
    const likesViewsComments = await prisma.interactions.findUnique({
        where: {
            id: interactionId,
        },
        select: {
            _count: {
                select: {
                    likes: true,
                    views: true,
                    childrenInteractions: {
                        where: {
                            type: 'C',
                        },
                    },
                },
            },
        },
    });

    const retweets = await prisma.interactions.findUnique({
        where: {
            id: interactionId,
        },
        select: {
            _count: {
                select: {
                    childrenInteractions: {
                        where: {
                            type: 'R',
                        },
                    },
                },
            },
        },
    });

    return {
        likes: likesViewsComments._count.likes,
        views: likesViewsComments._count.views,
        comments: likesViewsComments._count.childrenInteractions,
        retweets: retweets._count.childrenInteractions,
    };
};

/**
 * Adds a tweet interaction with optional media, mentions, and trends.
 *
 * @memberof Service.Interactions
 * @function addTweet
 * @async
 * @param {Array<String>} files - An array of files for media.
 * @param {string} text - The text content of the tweet.
 * @param {Array<String>} mentions - An array of user mentions in the tweet.
 * @param {Array<String>} trends - An array of trends associated with the tweet.
 * @param {string} userID - The ID of the user creating the tweet.
 * @returns {Promise<{
 *   id: number,
 *   userID: string,
 *   createdDate: string,
 *   text: string
 * }>} A promise that resolves to the tweet interaction object with selected fields.
 */
const addTweet = async (files, text, mentions, trends, userID) => {
    const mediaRecords = files?.map((file) => file.filename);

    const tweet = await prisma.interactions.create({
        data: {
            type: 'TWEET',
            text,
            mentions: {
                create: mentions.map((mention) => ({
                    userID: mention.id,
                })),
            },
            createdDate: new Date().toISOString(),
            userID,
            media: {
                create: mediaRecords?.map((mediaRecord) => ({
                    fileName: mediaRecord,
                })),
            },
        },
        select: {
            id: true,
            userID: true,
            createdDate: true,
            text: true,
        },
    });
    await addTrend(trends, tweet);
    return tweet;
};

/**
 * Adds trends associated with a tweet to the database.
 *
 * @memberof Service.Interactions
 * @method addTrend
 * @async
 * @param {Array<string>} trends - An array of trend texts to be associated with the tweet.
 * @param {Object} tweet - The tweet object for which trends are to be added.
 * @returns {Promise<void>} A promise that resolves once all trends are added to the database.
 */
const addTrend = async (trends, tweet) => {
    await prisma.trendsInteractions.createMany({
        data: trends.map((trend) => {
            return {
                trend: trend.toLowerCase(),
                interactionID: tweet.id,
            };
        }),
        skipDuplicates: true,
    });
};

/**
 * Deletes an interaction by ID from the database.
 *
 * @memberof Service.Interactions
 * @method deleteInteraction
 * @async
 * @param {number} id - The ID of the interaction to be deleted.
 * @returns {Promise<void>} A promise that resolves once the interaction is deleted from the database.
 */
const deleteinteraction = async (id) => {
    return await prisma.interactions.delete({
        where: {
            id,
        },
    });
};

/**
 * Checks if a user has a specific interaction by ID.
 *
 * @memberof Service.Interactions
 * @method checkUserInteractions
 * @async
 * @param {string} userID - The ID of the user to check for the interaction.
 * @param {string} interactionId - The ID of the interaction to check for.
 * @returns {Promise<boolean>} A promise that resolves to true if the user has the specified interaction, otherwise false.
 */
const checkUserInteractions = async (userID, interactionId) => {
    const interaction = await prisma.interactions.findUnique({
        where: {
            id: interactionId,
            userID: userID,
        },
    });

    if (interaction) return true;
    return false;
};

/**
 * Checks if an interaction with a specific ID exists.
 *
 * @memberof Service.Interactions
 * @method checkInteractions
 * @async
 * @param {number} id - The ID of the interaction to check for.
 * @returns {Promise<boolean>} A promise that resolves to true if the interaction exists, otherwise false.
 */
const checkInteractions = async (id) => {
    const interaction = await prisma.interactions.findUnique({
        where: {
            id: id,
        },
    });

    if (interaction) return true;
    return false;
};

/**
 * Checks and retrieves valid mentions from an array of mention usernames.
 *
 * @memberof Service.Interactions
 * @method checkMentions
 * @async
 * @param {Array<string>} mentions - An array of mention usernames to check.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects representing valid mentions.
 */
const checkMentions = async (mentions) => {
    if (mentions == null || mentions == undefined) {
        return [];
    }
    const realMentions = await Promise.all(
        mentions.map(async (mention) => {
            const user = await prisma.user.findUnique({
                where: {
                    username: mention,
                },
            });

            if (user !== null && user !== undefined) {
                return await prisma.user.findUnique({
                    where: { username: mention },
                });
            }
        })
    );
    const filteredMentions = realMentions.filter(
        (mention) => mention !== null && mention !== undefined
    );
    return filteredMentions;
};

/**
 * Records views for a set of interactions by a specific user.
 *
 * @async
 * @method
 * @memberof Service.Interactions
 * @param {number} userId - The ID of the user performing the views.
 * @param {number[]} interactionIds - An array of interaction IDs to be viewed.
 * @returns {Promise<{count:int}>} - A promise that resolves when views are recorded.
 */
const viewInteractions = async (userId, interactionIds) => {
    return await prisma.views.createMany({
        data: interactionIds.map((id) => {
            return { userID: userId, interactionID: id };
        }),
        skipDuplicates: true,
    });
};

/**
 * Adds a new reply (comment) interaction to the database.
 *
 * @param {object[]} files - An array of file objects representing media attachments.
 * @param {string} text - The text content of the reply.
 * @param {object[]} mentions - An array of mentions containing user IDs.
 * @param {string[]} trends - An array of trend topics associated with the reply.
 * @param {number} userID - The ID of the user who is posting the reply.
 * @param {number} parentId - The ID of the parent tweet to which the reply is associated.
 *
 * @returns {object} The created reply object.
 */
const addReply = async (files, text, mentions, trends, userID, parentId) => {
    const mediaRecords = files?.map((file) => file.filename);

    const tweet = await prisma.interactions.create({
        data: {
            type: 'COMMENT',
            text,
            mentions: {
                create: mentions.map((mention) => ({
                    userID: mention.id,
                })),
            },
            createdDate: new Date().toISOString(),
            userID,
            media: {
                create: mediaRecords?.map((mediaRecord) => ({
                    fileName: mediaRecord,
                })),
            },
            parentInteractionID: parentId,
        },
        select: {
            id: true,
            userID: true,
            createdDate: true,
            text: true,
        },
    });
    await addTrend(trends, tweet);
    return tweet;
};
export default {
    getInteractionStats,
    viewInteractions,
    addTweet,
    deleteinteraction,
    checkUserInteractions,
    checkInteractions,
    checkMentions,
    addReply,
};
