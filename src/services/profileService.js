import prisma from '../prisma.js';
/**
 * @namespace Profile
 * @memberof Service
 *
 */
/**
 * Get the count of tweets in the user's profile.
 *
 * @async
 * @function
 * @memberof Service.Profile
 * @param {number} userId - The user ID for which to fetch the tweet count.
 * @returns {Promise<number>} - The count of tweets in the user's profile.
 */
const getTweetsProfileCount = async (userId) => {
    return await prisma.interactions.count({
        where: {
            AND: [
                {
                    userID: userId,
                },
                {
                    type: 'TWEET',
                },
            ],
        },
    });
};

/**
 * Get the count of likes in the user's profile.
 *
 * @async
 * @function
 * @memberof Service.Profile
 * @param {number} userId - The user ID for which to fetch the like count.
 * @returns {Promise<number>} - The count of likes in the user's profile.
 */
const getLikesProfileCount = async (userId) => {
    return await prisma.likes.count({
        where: {
            userID: userId,
        },
    });
};

/**
 * Get the count of likes in the user's profile.
 *
 * @async
 * @function
 * @memberof Service.Profile
 * @param {number} userId - The user ID for which to fetch the like count.
 * @returns {Promise<number>} - The count of mentions in the user's profile.
 */
const getMentionsProfileCount = async (userId) => {
    return await prisma.mentions.count({
        where: {
            userID: userId,
        },
    });
};

/**
 * Get the tweets in the user's profile with additional information.
 *
 * @async
 * @function
 * @memberof Service.Profile
 * @param {number} userId - The user ID for which to fetch the tweets.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of tweets to retrieve.
 * @returns {Promise<Array<Object>>} - An array of tweets with additional information.
 */
const getTweetsProfile = async (me, userId, offset, limit) => {
    const interactions = await prisma.$queryRaw`
    SELECT 
    InteractionView.* ,
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${me}
    where InteractionView.userID=${userId} AND InteractionView.type="TWEET"
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return interactions;
};

/**
 * Get the likes in the user's profile with additional information.
 *
 * @async
 * @function
 * @memberof Service.Profile
 * @param {number} userId - The user ID for which to fetch the likes.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of likes to retrieve.
 * @returns {Promise<Array<Object>>} - An array of liked tweets with additional information.
 */
const getLikesProfile = async (me, userId, offset, limit) => {
    const interactions = await prisma.$queryRaw`
    SELECT 
    InteractionView.*, 
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView 
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${me}
    LEFT JOIN Likes  as L ON L.interactionID = InteractionView.interactionId 
    where L.userID=${userId} AND (InteractionView.type="TWEET" OR InteractionView.type="RETWEET") 
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return interactions;
};

/**
 * Get the likes in the user's profile with additional information.
 *
 * @async
 * @function
 * @memberof Service.Profile
 * @param {number} userId - The user ID for which to fetch the likes.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of likes to retrieve.
 * @returns {Promise<Array<Object>>} - An array of mentioned tweets with additional information.
 */
const getMentionsProfile = async (me, userId, offset, limit) => {
    const interactions = await prisma.$queryRaw`
    SELECT 
    InteractionView.*, 
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView 
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${me}
    LEFT JOIN Mentions  as M ON M.interactionID = InteractionView.interactionId 
    where M.userID=${userId} AND (InteractionView.type="TWEET" OR InteractionView.type="RETWEET") 
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return interactions;
};

export {
    getTweetsProfileCount,
    getTweetsProfile,
    getLikesProfileCount,
    getLikesProfile,
    getMentionsProfileCount,
    getMentionsProfile,
};