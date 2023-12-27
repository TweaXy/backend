import prisma from './prisma.js';
// Most liked tweet:
const getTheMostPopularTweet = async () => {
    const Tweets = await prisma.$queryRaw`
    SELECT 
    COUNT(LIKES.interactionID) AS like_count,
    COUNT(COMMENTS.parentInteractionID) AS comment_count,
    COUNT(RETWEETS.parentInteractionID) AS retweet_count,
    I.*

    FROM Interactions as I
    LEFT jOIN Likes AS LIKES ON LIKES.interactionID = I.id
    LEFT JOIN Interactions as COMMENTS ON COMMENTS.type = "COMMENT" AND COMMENTS.parentInteractionID = I.id
    LEFT JOIN Interactions as RETWEETS ON RETWEETS.type = "RETWEET" AND RETWEETS.parentInteractionID = I.id

    GROUP BY
    I.id
    ORDER BY(like_count+comment_count+retweet_count) DESC
    LIMIT 10
    `;

    return Tweets;
};

// Top 10 users with the most followers:
const getTheMostPopularUserFollowed = async () => {
    const users = await prisma.$queryRaw`
    SELECT 
    COUNT(F.followingUserID) AS follow_count,
    U.*

    FROM User as U
    LEFT jOIN Follow AS F ON F.followingUserID = U.id
    
    GROUP BY
    U.id
    ORDER BY(follow_count) DESC
    LIMIT 10
    `;
    return users;
};

// Users with the most mentions:
const getTheMostPopularUserMentioned = async () => {
    const users = await prisma.$queryRaw`
    SELECT 
    COUNT(M.userID) AS mention_count,
    U.*

    FROM User as U
    LEFT jOIN Mentions AS M ON M.userID = U.id
    
    GROUP BY
    U.id
    ORDER BY(mention_count) DESC
    LIMIT 10
    `;
    return users;
};

// Users with the most tweets:
const UersHasTweets = async () => {
    const users = await prisma.$queryRaw`
    SELECT 
    COUNT(I.userID) AS tweets_count,
    U.*

    FROM User as U
    LEFT jOIN Interactions AS I ON I.userID = U.id AND I.type= "TWEET"
    
    GROUP BY
    U.id
    ORDER BY(tweets_count) DESC
    LIMIT 10
    `;
    return users;
};

// Users with the most likes and retweets and comments on others tweets:
const activeUsers = async () => {
    const users = await prisma.$queryRaw`
    SELECT 
    COUNT(R.userID) AS retweet_count,
    COUNT(C.userID) AS comment_count,
    COUNT(L.userID) AS likes_count,
    U.*

    FROM User as U
    LEFT jOIN Interactions AS R ON R.userID = U.id AND R.type= "RETWEET"
    LEFT jOIN Interactions AS C ON C.userID = U.id AND C.type= "COMMENT"
    LEFT jOIN Likes AS L ON L.userID = U.id 
    
    GROUP BY
    U.id
    ORDER BY (retweet_count+comment_count+likes_count) DESC
    LIMIT 10
    `;
    return users;
};

// Most popular hashtags:
const getTheMostPopularHashtags = async () => {
    const hash = await prisma.$queryRaw`
        SELECT
        TI.trend,
        COUNT(TI.interactionID) AS usage_count
        FROM
        TrendsInteractions AS TI
        JOIN
        Interactions AS I ON I.id = TI.interactionID
        GROUP BY
        TI.trend
        ORDER BY
        usage_count DESC
        LIMIT 10
    `;
    return hash;
};

const users = await UersHasTweets();
console.log(users);

export {
    getTheMostPopularTweet,
    getTheMostPopularUserFollowed,
    getTheMostPopularHashtags,
    getTheMostPopularUserMentioned,
    UersHasTweets,
    activeUsers
};
