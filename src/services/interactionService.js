import prisma from '../prisma.js';
/**
 * @namespace Service.Interactions
 * @memberof Service
 */

/**
 * Get statistics for a specific interaction, including likes, views, comments, and retweets.
 *
 * @async
 * @method
 * @memberof Service.Interactions
 * @param {number} interactionId - The ID of the interaction for which to fetch statistics.
 * @returns {Promise<{likes: number, views: number, comments: number, retweets: number}>} - A promise that resolves with the interaction statistics.
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
 * Adds a tweet interaction with optional media, mentions, and trends.
 *
 * @memberof Service.Interactions
 * @function addTweet
 * @async
 * @param {Array<String>} files - An array of files for media.
 * @param {string} text - The text content of the tweet.
 * @param {Array<String>} mentions - An array of user mentions in the tweet.
 * @param {Array<String>} trends - An array of trends associated with the tweet.
 * @param {string} userID - The ID of the user creating the tweet.
 * @returns {Promise<{
 *   id: number,
 *   userID: string,
 *   createdDate: string,
 *   text: string
 * }>} A promise that resolves to the tweet interaction object with selected fields.
 */
const addTweet = async (files, text, mentions, trends, userID) => {
    const mediaRecords = files?.map((file) => file.filename);

    const tweet = await prisma.interactions.create({
        data: {
            type: 'TWEET',
            text,
            mentions: {
                create: mentions.map((mention) => ({
                    userID: mention.id,
                })),
            },
            createdDate: new Date().toISOString(),
            userID,
            media: {
                create: mediaRecords?.map((mediaRecord) => ({
                    fileName: mediaRecord,
                })),
            },
        },
        select: {
            id: true,
            userID: true,
            createdDate: true,
            text: true,
            type: true,
        },
    });
    await addTrend(trends, tweet);
    return tweet;
};

/**
 * Adds trends associated with a tweet to the database.
 *
 * @memberof Service.Trend
 * @method addTrend
 * @async
 * @param {Array<string>} trends - An array of trend texts to be associated with the tweet.
 * @param {Object} tweet - The tweet object for which trends are to be added.
 * @returns {Promise<void>} A promise that resolves once all trends are added to the database.
 */
const addTrend = async (trends, tweet) => {
    await prisma.trendsInteractions.createMany({
        data: !trends
            ? []
            : trends.map((trend) => {
                  return {
                      trend: trend.toLowerCase(),
                      interactionID: tweet.id,
                  };
              }),
        skipDuplicates: true,
    });
};

/**
 * Deletes an interaction by ID from the database.
 *
 * @memberof Service.Interactions
 * @method deleteInteraction
 * @async
 * @param {number} id - The ID of the interaction to be deleted.
 * @returns {Promise<void>} A promise that resolves once the interaction is deleted from the database.
 */
const deleteinteraction = async (id) => {
    return await prisma.interactions.delete({
        where: {
            id,
        },
        select: {
            id: true,
            type: true,
            text: true,
            createdDate: true,
            deletedDate: true,
            parentInteractionID: true,
            userID: true,
            media: true,
        },
    });
};

/**
 * Checks if a user has a specific interaction by ID.
 *
 * @memberof Service.Interactions
 * @method checkUserInteractions
 * @async
 * @param {string} userID - The ID of the user to check for the interaction.
 * @param {string} interactionId - The ID of the interaction to check for.
 * @returns {Promise<boolean>} A promise that resolves to true if the user has the specified interaction, otherwise false.
 */
const checkUserInteractions = async (userID, interactionId) => {
    const interaction = await prisma.interactions.findUnique({
        where: {
            id: interactionId,
            userID: userID,
        },
    });

    if (interaction) return true;
    return false;
};

/**
 * Checks if an interaction with a specific ID exists.
 *
 * @memberof Service.Interactions
 * @method checkInteractions
 * @async
 * @param {number} id - The ID of the interaction to check for.
 * @returns {Promise<boolean>} A promise that resolves to true if the interaction exists, otherwise false.
 */
const checkInteractions = async (id) => {
    const interaction = await prisma.interactions.findUnique({
        where: {
            id: id,
        },
        select: {
            user: true,
            text: true,
            type: true,
            id: true,
        },
    });

    if (interaction) return interaction;
    return null;
};

/**
 * Checks and retrieves valid mentions from an array of mention usernames.
 *
 * @memberof Service.Interactions
 * @method checkMentions
 * @async
 * @param {Array<string>} mentions - An array of mention usernames to check.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects representing valid mentions.
 */
const checkMentions = async (userId, mentions) => {
    if (mentions == null || mentions == undefined) {
        return [];
    }
    const realMentions = await prisma.user.findMany({
        where: {
            username: { in: mentions },
        },
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatar: true,
            blocking: true,
        },
    });
    console.log(realMentions[0].blocking);
    const filteredMentions = realMentions.filter((mention) => {
        const blockedIds = mention.blocking.map(
            (block) => block.blockingUserID
        );

        if (!blockedIds.includes(userId)) {
            delete mention.blocking;
            return mention;
        }
    });

    return filteredMentions;
};

/**
 * Records views for a set of interactions by a specific user.
 *
 * @async
 * @method
 * @memberof Service.Interactions
 * @param {number} userId - The ID of the user performing the views.
 * @param {number[]} interactionIds - An array of interaction IDs to be viewed.
 * @returns {Promise<{count:int}>} - A promise that resolves when views are recorded.
 */
const viewInteractions = async (userId, interactionIds) => {
    return await prisma.views.createMany({
        data: interactionIds.map((id) => {
            return { userID: userId, interactionID: id };
        }),
        skipDuplicates: true,
    });
};

/**
 * Adds a new reply (comment) interaction to the database.
 * @memberof Service.Interactions
 *
 * @param {object[]} files - An array of file objects representing media attachments.
 * @param {string} text - The text content of the reply.
 * @param {object[]} mentions - An array of mentions containing user IDs.
 * @param {string[]} trends - An array of trend topics associated with the reply.
 * @param {number} userID - The ID of the user who is posting the reply.
 * @param {number} parentId - The ID of the parent tweet to which the reply is associated.
 *
 * @returns {object} The created reply object.
 */
const addReply = async (files, text, mentions, trends, userID, parentId) => {
    const mediaRecords = files?.map((file) => file.filename);

    const tweet = await prisma.interactions.create({
        data: {
            type: 'COMMENT',
            text,
            mentions: {
                create: mentions.map((mention) => ({
                    userID: mention.id,
                })),
            },
            createdDate: new Date().toISOString(),
            userID,
            media: {
                create: mediaRecords?.map((mediaRecord) => ({
                    fileName: mediaRecord,
                })),
            },
            parentInteractionID: parentId,
        },
        select: {
            id: true,
            userID: true,
            createdDate: true,
            text: true,
            type: true,
        },
    });
    await addTrend(trends, tweet);
    return tweet;
};
/**
 * Adds a like interaction to the database.
 * @memberof Service.Interactions
 *
 * @param {number} userId - The ID of the user who is performing the like action.
 * @param {number} interactionId - The ID of the tweet to which the like is associated.
 *
 * @returns {Promise<void>} A Promise representing the completion of the like action.
 */
const addLike = async (userId, interactionId) => {
    await prisma.likes.create({
        data: {
            userID: userId,
            interactionID: interactionId,
        },
    });
};
/**
 * Checks if a specific interaction (tweet) is liked by a given user.
 *
 * @param {number} userId - The ID of the user whose like status is being checked.
 * @param {number} interactionId - The ID of the tweet for which the like status is being checked.
 *
 * @returns {Promise<boolean>} A Promise resolving to a boolean value indicating whether the interaction is liked by the user.
 *
 * @throws {Error} Throws an error if there is an issue checking the like status.
 */
const isInteractionLiked = async (userId, interactionId) => {
    const like = await prisma.likes.findUnique({
        where: {
            userID_interactionID: {
                userID: userId,
                interactionID: interactionId,
            },
        },
    });
    if (like) return true;
    else return false;
};

/**
 * remove a like interaction from the database.
 *
 * @param {number} userId - The ID of the user who is performing the like action.
 * @param {number} interactionId - The ID of the tweet to which the like is associated.
 *
 * @returns {Promise<void>} A Promise representing the completion of the unlike action.
 */
const removeLike = async (userId, interactionId) => {
    await prisma.likes.delete({
        where: {
            userID_interactionID: {
                userID: userId,
                interactionID: interactionId,
            },
        },
    });
};

/**
 * Get the count of tweets in the user's profile.
 *
 * @async
 * @function
 * @memberof Service.Interactions
 * @returns {Promise<number>} - The count of tweets .
 */
const getMatchingTweetsCount = async (keyword, userId) => {
    let count;
    if (userId) {
        count = await prisma.interactions.count({
            where: {
                AND: [
                    {
                        OR: [{ type: 'TWEET' }, { type: 'RETWEET' }],
                    },
                    { userID: userId },
                    { text: { contains: keyword } },
                ],
            },
        });
    } else {
        count = await prisma.interactions.count({
            where: {
                AND: [
                    {
                        OR: [{ type: 'TWEET' }, { type: 'RETWEET' }],
                    },
                    { text: { contains: keyword } },
                ],
            },
        });
    }
    return count;
};

/**
 * Search for matching tweets using a string
 *
 * @async
 * @function
 * @memberof Service.Interactions
 * @param {String} keyword - The used keyword for searching.
 * @param {String} userId - The ID of the user who is searching.
 * @param {String} searchedUserId - The ID of the user whom tweets are used for searching.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of tweets to retrieve.
 * @returns {Promise<Array<Object>>} - An array of tweets with additional information.
 */

const searchForTweetsInProfile = async (
    userId,
    keyword,
    searchedUserId,
    offset,
    limit
) => {
    const tweets = await prisma.$queryRaw`
    SELECT 
    InteractionView.* ,
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${userId}
    where InteractionView.text LIKE ${`%${keyword}%`} AND InteractionView.userID=${searchedUserId}  AND InteractionView.type="TWEET" AND InteractionView.deletedDate IS NULL
    ORDER BY InteractionView.createdDate  DESC 
    LIMIT ${limit} OFFSET ${offset}`;
    return tweets;
};

/**
 * Search for matching tweets of a specific user using a string
 *
 * @async
 * @function
 * @memberof Service.Interactions
 * @param {String} keyword - The used keyword for searching.
 * @param {String} userId - The ID of the user who is searching.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of tweets to retrieve.
 * @returns {Promise<Array<Object>>} - An array of tweets with additional information.
 */

const searchForTweets = async (userId, keyword, offset, limit) => {
    const tweets = await prisma.$queryRaw`
    SELECT 
    InteractionView.* ,
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted
    FROM InteractionView
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${userId}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${userId}
    where InteractionView.text LIKE ${`%${keyword}%`} AND InteractionView.type="TWEET" AND InteractionView.deletedDate IS NULL 
    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return tweets;
};

/**
 * get suggestion.
 *
 * @async
 * @method
 * @memberof Service.Interactions
 * @param {string} keyword - The keyword for which to search suggestions on .
 * @returns {Promise<{RightSnippet:string, LeftSnippet:string}>} - A promise that resolves when query are fetched.
 */
const searchSuggestions = async (keyword, limit, offset) => {
    const hashtag_keyword = `#${keyword}`;
    const num_words = keyword.split(' ').length;
    const suggestions = await prisma.$queryRaw`
        SELECT  
            -- get 2 words after 'keyword' if exists
            SUBSTRING_INDEX(SUBSTRING(text, LOCATE(${keyword}, text)), ' ', 2 + ${num_words}) AS RightSnippet, 
            -- get 2 words before 'keyword'
            SUBSTRING_INDEX(SUBSTRING(text, 1, LOCATE(${keyword}, text)+LENGTH(${keyword}) - 1), ' ', -2 - ${num_words}) AS LeftSnippet,
            -- get 2 words after '#keyword' if exists
            SUBSTRING_INDEX(SUBSTRING(text, LOCATE(${hashtag_keyword}, text)), ' ', 2 + ${num_words}) AS TagRightSnippet,  
            -- get 2 words before '#keyword' if exists
            SUBSTRING_INDEX(SUBSTRING(text, text LIKE CONCAT('%', ${hashtag_keyword}, '%'), LOCATE(${hashtag_keyword}, text)+LENGTH(${hashtag_keyword}) - 1), ' ', -2 - ${num_words}) AS TagLeftSnippet -- get '#keyword'
        FROM Interactions 
        WHERE  
            deletedDate IS NULL  
            AND  text LIKE CONCAT('%', ${keyword}, '%') 
            AND (type = 'TWEET')
        ORDER BY 
        CASE 
            WHEN text LIKE CONCAT('%', ${hashtag_keyword}, '%') THEN 1 -- prioritize '#keyword'
            ELSE 2 -- fallback to 'keyword'
        END,
        -- order by relevance
        MATCH (text) AGAINST (${keyword} IN NATURAL LANGUAGE MODE) DESC
        LIMIT ${limit} OFFSET ${offset}
    ;`;

    return suggestions.map((suggestion) => {
        return {
            rightSnippet: suggestion.TagRightSnippet || suggestion.RightSnippet,
            leftSnippet: suggestion.TagLeftSnippet || suggestion.LeftSnippet,
        };
    });
};

/**
 * get total count of suggestion.
 *
 * @async
 * @method
 * @memberof Service.Interactions
 * @param {string} keyword - The keyword for which to search suggestions on .
 * @returns {Promise<count>} - A promise that resolves when query are fetched.
 */
const getSuggestionsTotalCount = async (keyword) => {
    if (!keyword) return 0;
    return await prisma.interactions.count({
        where: {
            AND: [
                {
                    text: {
                        contains: keyword,
                    },
                },
                {
                    type: 'TWEET',
                },
            ],
        },
    });
};

/**
 * Gets replies for a specific interaction.
 *
 * @memberof Service.Interactions
 * @method getReplies
 * @async
 * @param {string} me - The user ID for whom the replies are fetched.
 * @param {string} id - The ID of the parent interaction for which replies are retrieved.
 * @param {number} limit - The maximum number of replies to fetch.
 * @param {number} offset - The offset for paginating through replies.
 * @returns {Promise<Array>} A promise that resolves to an array of interaction objects representing the replies.
 * @throws {Error} If there is an issue fetching the replies from the database.
 */
const getReplies = async (me, id, limit, offset) => {
    const replies = await prisma.$queryRaw`
    SELECT 
    InteractionView.*, 
    userLikes.interactionID IS NOT NULL AS isUserLiked,
    userComments.parentInteractionID IS NOT NULL AS isUserCommented,
    userRetweets.parentInteractionID IS NOT NULL AS isUserRetweeted,
    FollowFollowing.userID IS NOT NULL AS isFollowing,
    FollowFollowed.userID IS NOT NULL AS isFollowedBy
    FROM InteractionView 
    LEFT JOIN Likes as userLikes ON userLikes.interactionID = InteractionView.interactionID AND userLikes.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'COMMENT') AS userComments ON userComments.parentInteractionID = InteractionView.interactionID AND userComments.userID = ${me}
    LEFT JOIN (SELECT * FROM Interactions WHERE type = 'RETWEET') AS userRetweets ON userRetweets.parentInteractionID = InteractionView.interactionID AND userRetweets.userID = ${me}
   
     LEFT  JOIN User ON User.id=InteractionView.UserID 
    LEFT JOIN Follow AS FollowFollowing ON FollowFollowing.userID = ${me} AND FollowFollowing.followingUserID = InteractionView.UserID 
    LEFT JOIN Follow AS FollowFollowed ON FollowFollowed.userID = InteractionView.UserID AND FollowFollowed.followingUserID = ${me}
 
    where InteractionView.type='COMMENT' AND InteractionView.parentID=${id}
    

    ORDER BY InteractionView.createdDate  DESC
    LIMIT ${limit} OFFSET ${offset}`;
    return replies;
};

/**
 * Gets the count of replies for a specific interaction.
 *
 * @memberof Service.Interactions
 * @method getRepliesCount
 * @async
 * @param {string} id - The ID of the parent interaction for which replies count is retrieved.
 * @returns {Promise<number>} A promise that resolves to the count of replies for the specified interaction.
 * @throws {Error} If there is an issue fetching the replies count from the database.
 */
const getRepliesCount = async (id) => {
    return await prisma.interactions.count({
        where: {
            parentInteractionID: id,
        },
    });
};
export default {
    getInteractionStats,
    viewInteractions,
    addTweet,
    deleteinteraction,
    checkUserInteractions,
    checkInteractions,
    checkMentions,
    addReply,
    addLike,
    isInteractionLiked,
    removeLike,
    getMatchingTweetsCount,
    searchForTweets,
    searchForTweetsInProfile,
    searchSuggestions,
    getSuggestionsTotalCount,
    getReplies,
    getRepliesCount,
};
