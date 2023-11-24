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
const getUserTimeline = async (limit, offset, userId) => {
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
        TotalInteractions AS (
            SELECT COUNT(*) AS totalInteractionsCount FROM Interactions
        ),

        MediaFiles AS (
            SELECT GROUP_CONCAT(m.fileName SEPARATOR ', ') AS mediaFiles, interactionsID
            FROM media m
            GROUP BY m.interactionsID
        )
        SELECT 
            i.id as InteractionID,
            i.text,
            i.createdDate,
            i.type,
            m.mediaFiles as media,

            u.*,

            parentInteraction.id as parentID,
            parentInteraction.text as parentText,
            parentInteraction.createdDate as parentCreatedDate,
            parentInteraction.type as parentType,
            parentInteractionM.mediaFiles  as parentMedia,

            parentinteractionUser.userId as parentUserId,
            parentinteractionUser.username as parentUsername,
            parentinteractionUser.name as parentName,
            parentinteractionUser.avatar as parentAvatar,


            COALESCE(l.likesCount, 0) as likesCount,
            COALESCE(v.viewsCount, 0) as viewsCount,
            COALESCE(r.retweetsCount, 0) as retweetsCount,
            COALESCE(c.commentsCount, 0) as commentsCount,
            (
                30 * COALESCE(r.retweetsCount, 0) +
                20 * COALESCE(c.commentsCount, 0) +
                10 * COALESCE(l.likesCount, 0) +
                5 * COALESCE(v.viewsCount, 0) 
            )
            / GREATEST((SELECT totalInteractionsCount FROM TotalInteractions), 1)
            / POWER(2, TIMESTAMPDIFF(SECOND, i.createdDate, NOW()) / 3600)
            as Irank


        FROM Interactions as i

        LEFT JOIN LikesCount as l ON l.interactionID = i.id
        LEFT JOIN ViewsCount as v ON v.interactionID = i.id
        LEFT JOIN RetweetsCount as r ON r.parentInteractionID = i.id
        LEFT JOIN CommentsCount as c ON c.parentInteractionID = i.id

        LEFT JOIN Interactions as parentInteraction ON parentInteraction.id = i.parentInteractionID
        
        LEFT JOIN MediaFiles as m ON m.interactionsID = i.id 
        LEFT JOIN MediaFiles as parentInteractionM ON parentInteractionM.interactionsID = parentInteraction.id 

        INNER JOIN UserBaseInfo as u ON u.userId = i.userID
        LEFT JOIN UserBaseInfo as parentinteractionUser ON parentinteractionUser.userId = parentInteraction.userID

        INNER JOIN (
            SELECT FollowingUserID as id FROM Follow WHERE userID = ${userId}
        ) AS Followings ON Followings.id = i.userID
        
        WHERE (i.type = 'TWEET' OR i.type = 'RETWEET') AND i.deletedDate IS NULL 
        GROUP BY i.id, i.text, i.createdDate, l.likesCount, v.viewsCount, r.retweetsCount, c.commentsCount
        ORDER BY Irank  DESC
        LIMIT ${limit} OFFSET ${offset}
        
    `;
    return interactions.map((interaction) => {
        console.log(interaction);
        const mainInteraction = {
            id: interaction.InteractionID,
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
        return { mainInteraction, parentInteraction };
    });
};

export default {
    getInteractionStats,
    getUserTimeline,
};
