

CREATE VIEW InteractionView AS 
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
    WHERE type = 'RETWEET' AND deletedDate IS NULL
    GROUP BY parentInteractionID
),
CommentsCount AS (
    SELECT parentInteractionID, COUNT(*) AS commentsCount 
    FROM Interactions 
    WHERE type = 'COMMENT' AND deletedDate IS NULL
    GROUP BY parentInteractionID
),
TotalInteractionsCount AS (
    SELECT COUNT(*) AS totalInteractionsCount FROM Interactions
),
/* Interaction Media Files */
MediaFiles AS (
    SELECT GROUP_CONCAT(m.fileName SEPARATOR ', ') AS MediaFiles, InteractionsID
    FROM Media m
    GROUP BY m.InteractionsID
) 
/* Interaction Author Basic Info */
SELECT 
    /* Interaction basic info  */
    i.id as interactionId,
    i.text,
    i.createdDate,
    i.deletedDate,
    i.type,
    m.MediaFiles as Media,
    /* Interaction author basic info  */
    u.*,

    /* Paret Interaction basic info  */
    parentInteraction.id as parentID,
    parentInteraction.text as parentText,
    parentInteraction.createdDate as parentCreatedDate,
    parentInteraction.type as parentType,
    parentInteractionM.MediaFiles  as parentMedia,

    /* Paret Interaction autho basic info  */
    parentinteractionUser.UserId as parentUserId,
    parentinteractionUser.Username as parentUsername,
    parentinteractionUser.name as parentName,
    parentinteractionUser.avatar as parentAvatar,
    /* Interaction stats  */

    COALESCE(l.likesCount, 0) as likesCount,
    COALESCE(v.viewsCount, 0) as viewsCount,
    COALESCE(r.retweetsCount, 0) as retweetsCount,
    COALESCE(c.commentsCount, 0) as commentsCount,

    COALESCE(lp.likesCount, 0) as likesCountParent,
    COALESCE(vp.viewsCount, 0) as viewsCountParent,
    COALESCE(rp.retweetsCount, 0) as retweetsCountParent,
    COALESCE(cp.commentsCount, 0) as commentsCountParent


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

/* join to get Media for both main and parent interaction  */
LEFT JOIN MediaFiles as m ON m.InteractionsID = i.id 
LEFT JOIN MediaFiles as parentInteractionM ON parentInteractionM.InteractionsID = parentInteraction.id 

/* join to get User info for both main and parent interaction  */
INNER JOIN UserBaseInfo as u ON u.UserId = i.UserID
LEFT JOIN UserBaseInfo as parentinteractionUser ON parentinteractionUser.UserId = parentInteraction.UserID
        
WHERE   i.deletedDate IS NULL  AND (i.parentInteractionID IS NULL OR parentInteraction.deletedDate IS NULL);