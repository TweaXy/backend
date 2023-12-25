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
                    OR: [
                        {
                            type: 'TWEET',
                        },
                        {
                            type: 'RETWEET',
                        },
                    ],
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
const getLikesProfileCount = async (userId, me) => {
    // return await prisma.likes.count({
    //     where: {
    //         userID: userId,
    //     },
    // });

    const count = await prisma.$queryRaw`
    SELECT COUNT(L.userID)
    FROM Likes as L
    LEFT jOIN Interactions AS I ON I.ID =L.interactionID 
    LEFT JOIN Blocks as bl ON bl.userID =  I.userID AND bl.blockingUserID = ${me}
    LEFT JOIN Blocks as blk ON blk.userID = ${me} AND blk.blockingUserID =  I.userID
    WHERE L.UserID = ${userId}  AND bl.userID IS NULL AND blk.userID IS NULL`;

    const likeCount = Number(count[0]?.['COUNT(L.userID)']) || 0;
    return likeCount;
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
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted,

    userLikesP.interactionID IS NOT NULL AS isUserLikedP,
    userCommentsP.parentInteractionID IS NOT NULL AS isUserCommentedP,
    userRetweetsP.parentInteractionID IS NOT NULL AS isUserRetweetedP

    FROM InteractionView

    

    /* get if user interact with interactions */
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionId AND userLikes.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userComments ON userComments.parentInteractionID = InteractionView.interactionId AND userComments.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionId AND userRetweets.userID = ${me}

    LEFT JOIN Likes as userLikesP ON userLikesP.interactionID = InteractionView.parentID AND userLikesP.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userCommentsP ON userCommentsP.parentInteractionID = InteractionView.parentID AND userCommentsP.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userRetweetsP ON userRetweetsP.parentInteractionID = InteractionView.parentID AND userRetweetsP.userID=${me}


    where InteractionView.userID=${userId} AND (InteractionView.type="TWEET" OR InteractionView.type="RETWEET")
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
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted,

    userLikesP.interactionID IS NOT NULL AS isUserLikedP,
    userCommentsP.parentInteractionID IS NOT NULL AS isUserCommentedP,
    userRetweetsP.parentInteractionID IS NOT NULL AS isUserRetweetedP,
    FollowFollowing.userID IS NOT NULL AS followedByMe,
    MuteMuting.userID IS NOT NULL AS mutedByMe
    FROM InteractionView 
    
   /* get if user interact with interactions */
   LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionId AND userLikes.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userComments ON userComments.parentInteractionID = InteractionView.interactionId AND userComments.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionId AND userRetweets.userID = ${me}

    LEFT JOIN Likes as userLikesP ON userLikesP.interactionID = InteractionView.parentID AND userLikesP.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userCommentsP ON userCommentsP.parentInteractionID = InteractionView.parentID AND userCommentsP.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userRetweetsP ON userRetweetsP.parentInteractionID = InteractionView.parentID AND userRetweetsP.userID=${me}
    LEFT JOIN Follow AS FollowFollowing ON FollowFollowing.userID = ${me} AND FollowFollowing.followingUserID = InteractionView.UserID 
    LEFT JOIN Mutes AS MuteMuting ON MuteMuting.userID = ${me} AND MuteMuting.mutingUserID = InteractionView.UserID 
    
    LEFT JOIN Likes  as L ON L.interactionID = InteractionView.interactionId 
    /*no tweets from blocked or blocking users*/
    LEFT JOIN Blocks as bl ON bl.userID = ${me} AND bl.blockingUserID = InteractionView.userID 
    LEFT JOIN Blocks as blk ON blk.userID = InteractionView.userID AND blk.blockingUserID = ${me} 

    
    where L.userID=${userId}  AND bl.userID IS NULL AND blk.userID IS NULL
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
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted,

    userLikesP.interactionID IS NOT NULL AS isUserLikedP,
    userCommentsP.parentInteractionID IS NOT NULL AS isUserCommentedP,
    userRetweetsP.parentInteractionID IS NOT NULL AS isUserRetweetedP
    FROM InteractionView 
    /* get if user interact with interactions */
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionId AND userLikes.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userComments ON userComments.parentInteractionID = InteractionView.interactionId AND userComments.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionId AND userRetweets.userID = ${me}

    LEFT JOIN Likes as userLikesP ON userLikesP.interactionID = InteractionView.parentID AND userLikesP.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userCommentsP ON userCommentsP.parentInteractionID = InteractionView.parentID AND userCommentsP.userID = ${me}
    LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' AND deletedDate IS NULL GROUP BY parentInteractionID, userID) AS userRetweetsP ON userRetweetsP.parentInteractionID = InteractionView.parentID AND userRetweetsP.userID=${me}

    
    LEFT JOIN Mentions  as M ON M.interactionID = InteractionView.interactionId 
    where M.userID=${userId}  
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
