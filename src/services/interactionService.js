import prisma from '../prisma.js';
/**
 * @namespace Services.Interactions
 */
/**
 * @namespace Services.Interactions.Timeline
 */
/**
 * Type definition for the main interaction data.
 *
 * @typedef {Object} MainInteraction
 * @memberof Services.Interactions.Timeline
 * @property {number} id - The ID of the interaction.
 * @property {string} text - The text content of the interaction.
 * @property {string} createdDate - The date when the interaction was created.
 * @property {string} type - The type of the interaction.
 * @property {string[] | null} media - Array of media files associated with the interaction.
 * @property {Object} user - Information about the user who created the interaction.
 * @property {number} user.id - The ID of the user.
 * @property {string} user.username - The username of the user.
 * @property {string} user.name - The name of the user.
 * @property {string} user.avatar - The avatar of the user.
 * @property {number} likesCount - The count of likes for the interaction.
 * @property {number} viewsCount - The count of views for the interaction.
 * @property {number} retweetsCount - The count of retweets for the interaction.
 * @property {number} commentsCount - The count of comments for the interaction.
 * @property {number} Irank - The calculated rank for the interaction.
 */
/**
 * Type definition for the parent interaction data.
 *
 * @typedef {Object} ParentInteraction
 * @memberof Services.Interactions.Timeline
 * @property {number} id - The ID of the parent interaction.
 * @property {string} text - The text content of the parent interaction.
 * @property {string} createdDate - The date when the parent interaction was created.
 * @property {string} type - The type of the parent interaction.
 * @property {string[] | null} media - Array of media files associated with the parent interaction.
 * @property {Object} user - Information about the user who created the parent interaction.
 * @property {number} user.id - The ID of the user.
 * @property {string} user.username - The username of the user.
 * @property {string} user.name - The name of the user.
 * @property {string} user.avatar - The avatar of the user.
 */
/**
 * Type definition for the timeline interaction data.
 *
 * @typedef {Object} TimelineInteractionData
 * @memberof Services.Interactions.Timeline
 * @property {number[]} ids - Array of interaction IDs.
 * @property {Array<{ mainInteraction: MainInteraction, parentInteraction: ParentInteraction | null }>} data - Array of mapped interaction data.
 */

/**
 * Get statistics for a specific interaction, including likes, views, comments, and retweets.
 *
 * @async
 * @method
 * @memberof Services.Interactions
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
 * Fetch user timeline data from the database.
 *
 * @async
 * @method
 * @memberof Services.Interactions.Timeline
 * @param {number} userId - The user ID for which to fetch the timeline.
 * @param {number} limit - The maximum number of interactions to retrieve.
 * @param {number} offset - The offset for pagination.
 * @returns {Promise<Array<Object>>} - The raw timeline data from the database.
 */

const fetchUserTimeline = async (userId, limit, offset) => {
    const interactions = await prisma.$queryRaw`
        WITH LikesCount AS (
            SELECT interactionID, COUNT(*) AS likesCount 
            FROM Likes 
            GROUP BY interactionID
        ),
        ViewsCount AS (
            SELECT interactionID, COUNT(*) AS viewsCount 
            FROM Views 
            GROUP BY interactionID
        ),
        RetweetsCount AS (
            SELECT parentInteractionID, COUNT(*) AS retweetsCount 
            FROM Interactions 
            WHERE type = 'RETWEET' 
            GROUP BY parentInteractionID
        ),
        CommentsCount AS (
            SELECT parentInteractionID, COUNT(*) AS commentsCount 
            FROM Interactions 
            WHERE type = 'COMMENT' 
            GROUP BY parentInteractionID
        ),
        TotalInteractionsCount AS (
            SELECT COUNT(*) AS totalInteractionsCount FROM Interactions
        ),
        /* Interaction Media Files */
        MediaFiles AS (
            SELECT GROUP_CONCAT(m.fileName SEPARATOR ', ') AS mediaFiles, interactionsID
            FROM Media m
            GROUP BY m.interactionsID
        )
        SELECT 
            /* Interaction basic info  */
            i.id as interactionId,
            i.text,
            i.createdDate,
            i.type,
            m.mediaFiles as media,

            /* Interaction author basic info  */
            u.*,

            /* Paret Interaction basic info  */
            parentInteraction.id as parentID,
            parentInteraction.text as parentText,
            parentInteraction.createdDate as parentCreatedDate,
            parentInteraction.type as parentType,
            parentInteractionM.mediaFiles  as parentMedia,

            /* Paret Interaction autho basic info  */
            parentinteractionUser.userId as parentUserId,
            parentinteractionUser.username as parentUsername,
            parentinteractionUser.name as parentName,
            parentinteractionUser.avatar as parentAvatar,


            /* Interaction stats  */
            COALESCE(l.likesCount, 0) as likesCount,
            COALESCE(v.viewsCount, 0) as viewsCount,
            COALESCE(r.retweetsCount, 0) as retweetsCount,
            COALESCE(c.commentsCount, 0) as commentsCount,
            /* calculate rank  */
            (
                30 * COALESCE(r.retweetsCount, 0) +
                20 * COALESCE(c.commentsCount, 0) +
                10 * COALESCE(l.likesCount, 0) +
                5 * COALESCE(v.viewsCount, 0) 
            )
            / GREATEST((SELECT totalInteractionsCount FROM TotalInteractionsCount), 1)
            / POWER(2, TIMESTAMPDIFF(SECOND, i.createdDate, NOW()) / 3600)
            as Irank


        FROM Interactions as i

        /* join for stats  */
        LEFT JOIN LikesCount as l ON l.interactionID = i.id
        LEFT JOIN ViewsCount as v ON v.interactionID = i.id
        LEFT JOIN RetweetsCount as r ON r.parentInteractionID = i.id
        LEFT JOIN CommentsCount as c ON c.parentInteractionID = i.id

        /* join to get parent interaction  */
        LEFT JOIN Interactions as parentInteraction ON parentInteraction.id = i.parentInteractionID
        
        /* join to get media for both main and parent interaction  */
        LEFT JOIN MediaFiles as m ON m.interactionsID = i.id 
        LEFT JOIN MediaFiles as parentInteractionM ON parentInteractionM.interactionsID = parentInteraction.id 

        /* join to get user info for both main and parent interaction  */
        INNER JOIN UserBaseInfo as u ON u.userId = i.userID
        LEFT JOIN UserBaseInfo as parentinteractionUser ON parentinteractionUser.userId = parentInteraction.userID

        /* join to get interaction of users followed by the user's timeline  */
        INNER JOIN (
            SELECT FollowingUserID as id FROM Follow WHERE userID = ${userId}
            UNION
            SELECT ${userId} as id
        ) AS Followings ON Followings.id = i.userID
        /* select only tweets and retweets and skip deleted date */
        WHERE (i.type = 'TWEET' OR i.type = 'RETWEET') AND i.deletedDate IS NULL 
        ORDER BY Irank  DESC
        LIMIT ${limit} OFFSET ${offset}
        
    `;
    return interactions;
};


/**
 * Map raw database interactions to the required format.
 *
 * @method
 * @memberof Services.Interactions.Timeline
 * @param {object[]} interactions - The raw database interactions.
 * @returns {{ids: number[], data: Array<TimelineInteractionData>}} - The mapped data.
 */
const mapInteractions = (interactions) => {
    const ids = [];
    const data = interactions.map((interaction) => {
        //add ids
        ids.push(interaction.interactionId);

        //add parent id if exists
        if (interaction.parentID) ids.push(interaction.parentID);

        // map main interaction to required format
        const mainInteraction = {
            id: interaction.interactionId,
            text: interaction.text,
            createdDate: interaction.createdDate,
            type: interaction.type,
            media: interaction.media?.split(',') ?? null,
            user: {
                id: interaction.userId,
                username: interaction.username,
                name: interaction.name,
                avatar: interaction.avatar,
            },
            likesCount: interaction.likesCount,
            viewsCount: interaction.viewsCount,
            retweetsCount: interaction.retweetsCount,
            commentsCount: interaction.commentsCount,
            Irank: interaction.Irank,
        };

        // map parent interaction to required format if exist
        const parentInteraction =
            interaction.type !== 'RETWEET'
                ? null
                : {
                      id: interaction.parentID,
                      text: interaction.parentText,
                      createdDate: interaction.parentCreatedDate,
                      type: interaction.parentType,
                      media: interaction.parentMedia?.split(',') ?? null,
                      user: {
                          id: interaction.parentUserId,
                          username: interaction.parentUsername,
                          name: interaction.parentName,
                          avatar: interaction.parentAvatar,
                      },
                  };
        // return main and parent interaction mapped format
        return { mainInteraction, parentInteraction };
    });

    return { ids, data };
};

/**
 * Get stats of interaction using userID.
 *
 * @async
 * @method
 * @memberof Services.Interactions.Timeline
 * @param {number} userId - The user ID for which to fetch the timeline.
 * @param {number} limit - The maximum number of interactions to retrieve.
 * @param {number} offset - The offset for pagination.
 * @returns {Promise<{ids: number[], data: Array<TimelineInteractionData>}>} - The timeline data.
 */
const getUserTimeline = async (userId, limit, offset) => {
    const interactions = await fetchUserTimeline(userId, limit, offset);

    return mapInteractions(interactions);
};

/**
 * Records views for a set of interactions by a specific user.
 *
 * @async
 * @method
 * @memberof Services.Interactions
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
 * Gets the total count of interactions in the timeline for a specific user.
 *
 * @async
 * @memberof Services.Interactions.Timeline
 * @method
 * @param {number} userId - The ID of the user whose timeline interactions are counted.
 * @returns {Promise<number>} - A promise that resolves with the total count of timeline interactions.
 */
const getTimelineInteractionTotalCount = async (userId) => {
    return await prisma.interactions.count({
        where: {
            AND: [
                {
                    user: {
                        OR: [
                            {
                                followedBy: {
                                    some: {
                                        userID: userId,
                                    },
                                },
                            },
                            {
                                id: userId,
                            },
                        ],
                    },
                    OR: [{ type: 'TWEET' }, { type: 'RETWEET' }],
                },
            ],
        },
    });
};

/**
 * Adds a new tweet interaction to the database.
 *
 * @param {object[]} files - An array of file objects representing media attachments.
 * @param {string} text - The text content of the tweet.
 * @param {object[]} mentions - An array of mentions containing user IDs.
 * @param {string[]} trends - An array of trend topics associated with the tweet.
 * @param {number} userID - The ID of the user who is posting the tweet.
 *
 * @returns {object} The created tweet object.
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
const addTrend = async (trends, tweet) => {
    for (let i in trends) {
        const trend = await prisma.trends.findUnique({
            where: { text: trends[i] },
        });
        if (trend) {
            await prisma.trendsInteractions.create({
                data: {
                    trendID: trend.id,
                    interactionID: tweet.id,
                },
            });
        } else {
            await prisma.trends.create({
                data: {
                    text: trends[i],
                    interactions: {
                        create: [{ interactionID: tweet.id }],
                    },
                },
            });
            6;
        }
    }
};
const deleteinteraction = async (id) => {
    return await prisma.interactions.delete({
        where: {
            id,
        },
    });
};
/**
 * Checks if a user has interacted with a specific interaction (tweet or reply).
 *
 * @param {number} userID - The ID of the user.
 * @param {number} interactionId - The ID of the interaction to be checked.
 *
 * @returns {boolean} True if the user has interacted, otherwise false.
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
 * Checks if an interaction (tweet or reply) exists in the database.
 *
 * @param {number} id - The ID of the interaction to be checked.
 *
 * @returns {boolean} True if the interaction exists, otherwise false.
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
 * Checks and filters mentions to ensure they correspond to existing user accounts in the database.
 *
 * @param {string[]} mentions - An array of mention usernames.
 *
 * @returns {object[]} An array of valid user objects for the provided mentions.
 */
const checkMentions = async (mentions) => {
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
    getUserTimeline,
    viewInteractions,
    getTimelineInteractionTotalCount,
    addTweet,
    deleteinteraction,
    checkUserInteractions,
    checkInteractions,
    checkMentions,
    addReply,
};
