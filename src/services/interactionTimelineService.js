import prisma from '../prisma.js';
/**
 * @namespace Timeline
 * @memberof Service.Interactions
 *
 */

/**
 * Type definition for the main interaction data.
 *
 * @typedef {Object} MainInteraction
 * @memberof Service.Interactions.Timeline
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
 * @memberof Service.Interactions.Timeline
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
 * @memberof Service.Interactions.Timeline
 * @property {number[]} ids - Array of interaction IDs.
 * @property {Array<{ mainInteraction: MainInteraction, parentInteraction: ParentInteraction | null }>} data - Array of mapped interaction data.
 */

/**
 * Fetch user timeline data from the database.
 *
 * @async
 * @method
 * @memberof Service.Interactions.Timeline
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
        /* Interaction Author Basic Info */
        SELECT 
            /* Interaction basic info  */
            i.id as interactionId,
            i.text,
            -- i.createdDate,
            i.type,
            -- m.mediaFiles as media,

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

            
            -- userLikes.interactionID IS NOT NULL AS isUserLiked,
            -- userComments.parentInteractionID IS NOT NULL AS isUserCommented,
            -- userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted,

            -- userLikesP.interactionID IS NOT NULL AS isUserLikedP,
            -- userCommentsP.parentInteractionID IS NOT NULL AS isUserCommentedP,
            -- userRetweetsP.parentInteractionID IS NOT NULL AS isUserRetweetedP,
            -- /* Interaction stats  */
            COALESCE(l.likesCount, 0) as likesCount,
            COALESCE(v.viewsCount, 0) as viewsCount,
            COALESCE(r.retweetsCount, 0) as retweetsCount,
            COALESCE(c.commentsCount, 0) as commentsCount,

            COALESCE(lp.likesCount, 0) as likesCountParent,
            COALESCE(vp.viewsCount, 0) as viewsCountParent,
            COALESCE(rp.retweetsCount, 0) as retweetsCountParent,
            COALESCE(cp.commentsCount, 0) as commentsCountParent,
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

        LEFT JOIN LikesCount as lp ON lp.interactionID = i.parentInteractionID
        LEFT JOIN ViewsCount as vp ON vp.interactionID = i.parentInteractionID
        LEFT JOIN RetweetsCount as rp ON rp.parentInteractionID = i.parentInteractionID
        LEFT JOIN CommentsCount as cp ON cp.parentInteractionID = i.parentInteractionID

        /* join to get parent interaction  */
        LEFT JOIN Interactions as parentInteraction ON parentInteraction.id = i.parentInteractionID
        
        /* join to get media for both main and parent interaction  */
        LEFT JOIN MediaFiles as m ON m.interactionsID = i.id 
        LEFT JOIN MediaFiles as parentInteractionM ON parentInteractionM.interactionsID = i.parentInteractionID

        /* join to get user info for both main and parent interaction  */
        INNER JOIN UserBaseInfo as u ON u.userId = i.userID
        LEFT JOIN UserBaseInfo as parentinteractionUser ON parentinteractionUser.userId = parentInteraction.userID

        /* join to get interaction of users followed by the user's timeline  */
        INNER JOIN (
            SELECT FollowingUserID as id FROM Follow WHERE userID = ${userId}
            UNION
            SELECT ${userId} as id
        ) AS Followings ON Followings.id = i.userID

        
        /* get if user interact with interactions */
        LEFT JOIN Likes as userLikes ON userLikes.interactionID = i.id AND userLikes.userID = ${userId}
        LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' GROUP BY parentInteractionID, userID) AS userComments ON userComments.parentInteractionID = i.id AND userComments.userID = ${userId}
        LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' GROUP BY parentInteractionID, userID) AS userRetweets ON userRetweets.parentInteractionID = i.id AND userRetweets.userID = ${userId}

        /* get if user interact with parent interactions */
        LEFT JOIN Likes as userLikesP ON userLikesP.interactionID = i.parentInteractionID AND userLikes.userID = ${userId}
        LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'COMMENT' GROUP BY parentInteractionID, userID) AS userCommentsP ON userCommentsP.parentInteractionID = i.parentInteractionID AND userCommentsP.userID = ${userId}
        LEFT JOIN (SELECT parentInteractionID, userID FROM Interactions WHERE type = 'RETWEET' GROUP BY parentInteractionID, userID) AS userRetweetsP ON userRetweetsP.parentInteractionID = i.parentInteractionID AND userRetweetsP.userID = ${userId}
        /* get muted users */
        LEFT JOIN Mutes as mu ON mu.userID = ${userId} AND mu.mutingUserID = i.userID
        /* select only tweets and retweets and skip deleted date */
        WHERE (i.type = 'TWEET' OR i.type = 'RETWEET') AND i.deletedDate IS NULL AND mu.mutingUserID IS NULL
        ORDER BY Irank  DESC
        LIMIT ${limit} OFFSET ${offset}
        
    `;
    console.log(interactions);
    return interactions;
};

/**
 * Gets the total count of interactions in the timeline for a specific user.
 *
 * @async
 * @memberof Service.Interactions.Timeline
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
                },
                { OR: [{ type: 'TWEET' }, { type: 'RETWEET' }] },
                { user: { NOT: { mutedBy: { some: { userID: userId } } } } },
            ],
        },
    });
};

export default {
    fetchUserTimeline,
    getTimelineInteractionTotalCount,
};
