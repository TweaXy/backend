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
const getTopInteractions = async (page, pageSize) => {
    const interactions = await prisma.$queryRaw`
        SELECT 
            i.id as InteractionID,
            i.text,
            i.createdDate,
            COALESCE(CAST(l.likesCount AS SIGNED), 0) AS likesCount,
            COALESCE(CAST(v.viewsCount AS SIGNED), 0) AS viewsCount,
            COALESCE(CAST(r.retweetsCount AS SIGNED), 0) AS retweetsCount,
            COALESCE(CAST(c.commentsCount AS SIGNED), 0) AS commentsCount,
            (
                30 * COALESCE(CAST(r.retweetsCount AS SIGNED), 0) +
                20 * COALESCE(CAST(c.commentsCount AS SIGNED), 0) +
                10 * COALESCE(CAST(l.likesCount AS SIGNED), 0) +
                5 * COALESCE(CAST(v.viewsCount AS SIGNED), 0) 
            )
            / GREATEST((SELECT COUNT(*) FROM Interactions), 1)
            / POWER(2, TIMESTAMPDIFF(SECOND, i.createdDate, NOW()) / 3600)
            AS Irank
        FROM Interactions AS i
        LEFT JOIN (
            SELECT interactionID, COUNT(*) AS likesCount 
            FROM Likes 
            GROUP BY interactionID
        ) l ON l.interactionID = i.id

        LEFT JOIN (
            SELECT interactionID, COUNT(*) AS viewsCount 
            FROM Views 
            GROUP BY interactionID
        ) v ON v.interactionID = i.id

        LEFT JOIN (
            SELECT parentInteractionID, COUNT(*) AS retweetsCount 
            FROM Interactions 
            WHERE type = 'RETWEET' 
            GROUP BY parentInteractionID
        ) r ON r.parentInteractionID = i.id

        LEFT JOIN (
            SELECT parentInteractionID, COUNT(*) AS commentsCount 
            FROM Interactions 
            WHERE type = 'COMMENT' 
            GROUP BY parentInteractionID
        ) c ON c.parentInteractionID = i.id
            
        WHERE i.type = 'TWEET'
        ORDER BY Irank DESC
        LIMIT ${(page - 1) * pageSize}, ${pageSize}

    `;
    return interactions;
};

const addTweet=async(files,text,userID)=>{
const mediaRecords = files.map((file) => file.filename );
return await prisma.interactions.create({
    data: {
     type:'TWEET',
     text,
     createdDate:new Date().toISOString(),
     userID, 
     media: {
        create: mediaRecords.map((mediaRecord) => ({
          fileName: mediaRecord,
        })),
      }
    }
  });
};


const deleteinteraction=async(id)=>
{
    await prisma.interactions.delete({
        where:
        {
            id
        }
    });
};
const checkUserInteractions=async(userID,interactionId)=>{
    const interaction= await prisma.interactions.findUnique({
        where: {
            id: interactionId,
            deletedDate: null,
           userID: userID
        },
    });
  
    if(interaction)
         return true;
    return false;
};
const checkInteractions=async(id)=>{

  const interaction= await prisma.interactions.findUnique({
    where: {
        id: id,
        deletedDate:null
    },
});
  
    if(interaction)
         return true;
    return false;
};
export default {
    getInteractionStats,
    getTopInteractions,
    addTweet,
    deleteinteraction,
    checkUserInteractions,
    checkInteractions


};
