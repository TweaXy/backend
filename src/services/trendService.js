import prisma from '../prisma.js';
/**
 * @namespace Service.Trend
 */

/**
 * Gets trends sorted by the number of tweets within each trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @param {number} limit - The maximum number of trends to retrieve.
 * @param {number} offset - The number of trends to skip before starting to collect the trends.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of trends sorted by tweet count.
 */
const getTrendsSorted = async (limit, offset) => {
    const trends = await prisma.trendsInteractions.groupBy({
        take: limit,
        skip: offset,
        by: 'trend',
        orderBy: {
            _count: {
                interactionID: 'desc',
            },
        },
        _count: {
            interactionID: true,
        },
    });
    return trends.map((trend) => {
        return {
            trend: trend.trend,
            count: trend._count.interactionID,
        };
    });
};

/**
 * Gets interactions for a specific trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @param {string} trend - The trend for which to retrieve interactions.
 * @returns {Promise<Array<InteractionSelectSchema>>} A promise that resolves to an array of interactions for the specified trend.
 */
const getTrendInteractions = async (trend, userId, limit, offset) => {
    const interactions = await prisma.$queryRaw`
    SELECT 
        InteractionView.*, 
        userLikes.interactionID IS NOT NULL AS isUserLiked,
        userComments.parentInteractionID IS NOT NULL AS isUserCommented,
        userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView 
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${userId}

    LEFT JOIN Mutes as mu ON mu.userID = ${userId} AND mu.mutingUserID = InteractionView.userID
    LEFT JOIN Blocks as blk ON blk.userID =InteractionView.userID AND blk.blockingUserID = ${userId}
    LEFT JOIN Blocks as bl ON bl.userID = ${userId} AND bl.blockingUserID = InteractionView.userID

    INNER JOIN TrendsInteractions ON TrendsInteractions.interactionID = InteractionView.interactionID AND TrendsInteractions.trend = ${trend}
    -- AND InteractionView.deletedDate IS NULL

    where mu.userID IS NULL AND bl.userID IS NULL AND blk.blockingUserID IS NULL
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return interactions;
};

/**
 * Gets interactions for a specific trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @returns {Promise<Number>} A promise that resolves to the total number of trends.
 */
const getTrendsTotalCount = async () => {
    const trendsCount = await prisma.trendsInteractions.groupBy({
        by: 'trend',
    });
    return trendsCount.length;
};

/**
 * Gets interactions for a specific trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @returns {Promise<Number>} A promise that resolves to the total number of trends.
 */
const getTrendsInteractionTotalCount = async (trend,me) => {
    const count = await prisma.$queryRaw`
    SELECT COUNT(I.id)
    FROM TrendsInteractions as T
    LEFT JOIN Interactions as I ON I.id =  T.interactionID
    LEFT JOIN Mutes as mu ON mu.userID =  ${me} AND mu.mutingUserID = I.userID
    LEFT JOIN Blocks as bl ON bl.userID =  I.userID AND bl.blockingUserID = ${me}
    LEFT JOIN Blocks as blk ON blk.userID = ${me} AND blk.blockingUserID =  I.userID
    WHERE I.type = 'TWEET' AND T.trend = ${trend} AND bl.userID IS NULL AND blk.userID IS NULL AND mu.userID IS NULL`;

    const trendsCount = Number(count[0]?.['COUNT(I.id)']) || 0;
    return trendsCount;

};

export default {
    getTrendsSorted,
    getTrendInteractions,
    getTrendsTotalCount,
    getTrendsInteractionTotalCount,
};
