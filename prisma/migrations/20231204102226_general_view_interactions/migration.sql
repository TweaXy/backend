

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
    i.createdDate,
    i.deletedDate,
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
    COALESCE(c.commentsCount, 0) as commentsCount


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
WHERE (i.type = 'TWEET' OR i.type = 'RETWEET') AND i.deletedDate IS NULL ;