import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';
import {
    separateMentionsTrends,
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
} from '../utils/index.js';

const createTweet = catchAsync(async (req, res, next) => {
    const userID = req.user.id;
    const text = req.body.text;

    //check if there is no text or media
    if (!text && (req.files == null || req.files.length <= 0)) {
        return next(new AppError('tweet can not be empty', 400));
    }
    const { mentions, trends } = separateMentionsTrends(text);
    //check that all mentions are users
    const filteredMentions = await intercationServices.checkMentions(mentions);

    const tweet = await intercationServices.addTweet(
        req.files,
        text,
        filteredMentions,
        trends,
        userID
    );
    const mentionedUserData = filteredMentions.map((mention) => ({
        id: mention.id,
        username: mention.username,
        name: mention.name,
        email: mention.email,
    }));

    const media = !req.files ? [] : req.files.map((file) => file.path);
    return res.status(201).send({
        data: { tweet, mentionedUserData, trends, media },
        status: 'success',
    });
});

const suggestTweets = catchAsync(async (req, res, next) => {
    let { offset, limit } = getOffsetAndLimit(req);
    const { keyword } = req.query;
    const totalCount =
        await intercationServices.getSuggestionsTotalCount(keyword);
    offset = Math.min(offset, totalCount);

    const suggestions = await intercationServices.searchSuggestions(
        keyword,
        limit,
        offset
    );

    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        suggestions
    );

    return res.json({
        status: 'success',
        data: { items: suggestions },
        pagination,
    });
});

export { createTweet, suggestTweets };
