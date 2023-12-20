import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';
import userService from '../services/userService.js';
import {
    separateMentionsTrends,
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
    mapInteractions,
} from '../utils/index.js';

import { uploadMultipleFile } from '../utils/aws.js';
import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

const createTweet = catchAsync(async (req, res, next) => {
    const userID = req.user.id;
    const text = req.body.text;

    //check if there is no text or media
    if (!text && (req.files == null || req.files.length <= 0)) {
        return next(new AppError('tweet can not be empty', 400));
    }
    const { mentions, trends } = separateMentionsTrends(text);
    //check that all mentions are users
    const mentionedUserData = await intercationServices.checkMentions(
        req.user.id,
        mentions
    );

    let mediakeys=[];
    if (req.files) {
     mediakeys= await uploadMultipleFile(req.files);

        await Promise.all(
            req.files.map(async (file) => {
                await unlinkFile(file.path);
            })
        );
    }
    const tweet = await intercationServices.addTweet(
        mediakeys,
        text,
        mentionedUserData,
        trends,
        userID
    );
 

    req.mentions = mentionedUserData;
    req.interaction = tweet;
    
    /////upload medio on S3
    
    res.status(201).send({
        data: { tweet, mentionedUserData, trends, mediakeys },
        status: 'success',
    });
    next();
});

const searchForTweets = catchAsync(async (req, res, next) => {
    const myId = req.user.id;
    const searchedUserUsername = req.query.username;
    let keyword = req.query.keyword;
    if (!keyword) keyword = '';
    let { offset, limit } = getOffsetAndLimit(req);
    let searchedUserId;
    if (searchedUserUsername) {
        const user =
            await userService.getUserBasicInfoByUUID(searchedUserUsername);
        if (!user) {
            return next(new AppError('no user found', 404));
        }
        searchedUserId = user.id;
    }
    const totalCount = await intercationServices.getMatchingTweetsCount(
        keyword,
        searchedUserId
    );
    offset = Math.min(offset, totalCount);
    let searchedTweets;
    if (searchedUserId) {
        searchedTweets = await intercationServices.searchForTweetsInProfile(
            myId,
            keyword,
            searchedUserId,
            offset,
            limit
        );
    } else
        searchedTweets = await intercationServices.searchForTweets(
            myId,
            keyword,
            offset,
            limit
        );

    // eslint-disable-next-line no-unused-vars
    const { ids: tweetsID, data: tweets } = mapInteractions(searchedTweets);

    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        tweets
    );

    return res.status(200).send({
        data: { items: tweets },
        pagination,
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

export { createTweet, searchForTweets, suggestTweets };
