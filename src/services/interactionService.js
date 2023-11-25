import prisma from '../prisma.js';

/**
 * get stats of interaction using userID
 * @async
 * @method
 * @param {String} id - User id
 * @returns {{Int}} count
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
 * get stats of interaction using userID
 * @async
 * @method
 * @returns {} count
 */
const getUserTimeline = async (userId, limit, offset) => {
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
            FROM media m
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

    const ids = []; // collect ids of interactions and parent interactions
    // map output of sql query to the required format
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

    return {
        ids,
        data,
    };
};

const viewInteractions = async (userId, interactionIds) => {
    return await prisma.views.createMany({
        data: interactionIds.map((id) => {
            return { userID: userId, interactionID: id };
        }),
        skipDuplicates: true,
    });
};

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
export default {
    getInteractionStats,
    getUserTimeline,
    viewInteractions,
    getTimelineInteractionTotalCount,
};
