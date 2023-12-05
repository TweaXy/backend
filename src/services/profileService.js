import prisma from '../prisma.js';

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

const getLikesProfileCount = async (userId) => {
    return await prisma.likes.count({
        where: {
            userID: userId,
        },
    });
};

const getTweetsProfile = async (userId, offset, limit) => {
    const interactions = await prisma.$queryRaw`
    SELECT 
    InteractionView.* ,
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${userId}
    where InteractionView.userID=${userId} AND InteractionView.type="TWEET" AND InteractionView.deletedDate IS NULL
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return interactions;
};

const getLikesProfile = async (userId, offset, limit) => {
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
    LEFT JOIN Likes  as L ON L.interactionID = InteractionView.interactionId
    where L.userID=${userId} AND (InteractionView.type="TWEET" OR InteractionView.type="RETWEET") 
    -- AND InteractionView.deletedDate IS NULL
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return interactions;
};

export {
    getTweetsProfileCount,
    getTweetsProfile,
    getLikesProfileCount,
    getLikesProfile,
};
