import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';

import {
    separateMentionsTrends,
    getOffsetAndLimit,
    catchAsync,
    pagination,
    mapInteractions,
    calcualtePaginationData,
} from '../utils/index.js';
import { userSchema } from '../services/index.js';

import { uploadMultipleFile, deleteMultipleFile } from '../utils/aws.js';
import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

const deleteinteraction = catchAsync(async (req, res, next) => {
    //check if the interaction exist
    const checkInteractions = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!checkInteractions) {
        return next(new AppError('no interaction by this id', 404));
    }
    //check if the user is the owner of the interaction being deleted
    const checkUserInteractions =
        await intercationServices.checkUserInteractions(
            req.user.id,
            req.params.id
        );
    if (!checkUserInteractions) {
        return next(new AppError('user not authorized', 401));
    }

    const interaction = await intercationServices.deleteinteraction(
        req.params.id
    );

    /////delete  medio from S3
    if (interaction.media) {
        await deleteMultipleFile(interaction.media);
    }

    return res.status(200).send({ data: interaction, status: 'success' });
});

const getLikers = catchAsync(async (req, res, next) => {
    //check if the interaction exist
    const checkInteractions = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!checkInteractions) {
        return next(new AppError('no interaction by this id', 404));
    }
    const currentUserID = req.user.id;
    const schema = {
        where: {
            interactionID: req.params.id,
        },
        select: {
            ...userSchema(currentUserID),
        },
    };
    const paginationData = await pagination(req, 'likes', schema);
    let items = paginationData.data.items;
    let likers = items.map((entry) => entry.user);
    likers = likers.filter((user) => {
        user.followedByMe = user.followedBy.length > 0;
        user.followsMe = user.following.length > 0;

        // Condition to exclude users
        if (user.blockedBy.length > 0 || user.blocking.length > 0) {
            return false; // Exclude user if the condition is true
        }

        delete user.followedBy;
        delete user.following;
        delete user.blockedBy;
        delete user.blocking;

        return true; // Include user if not excluded
    });

    return res.status(200).send({
        data: { likers },
        pagination: paginationData.pagination,
        status: 'success',
    });
});

const createReply = catchAsync(async (req, res, next) => {
    const userID = req.user.id;
    const text = req.body.text;

    //check if there is no text or media
    if (!text && (req.files == null || req.files.length <= 0)) {
        return next(new AppError('reply can not be empty', 400));
    }
    //check that parent interaction exist
    const tweeetExist = await intercationServices.checkInteractions(
        req.params.id
    );

    if (!tweeetExist || tweeetExist == null) {
        return next(new AppError('no interaction by this id', 404));
    }
    req.parentinteraction = tweeetExist;

    const { mentions, trends } = separateMentionsTrends(text);
    //check that all mentions are users
    const mentionedUserData = await intercationServices.checkMentions(
        req.user.id,
        mentions
    );
    let mediaKeys;
    /////upload medio on S3
    if (req.files) {
        mediaKeys = await uploadMultipleFile(req.files);

        await Promise.all(
            req.files.map(async (file) => {
                await unlinkFile(file.path);
            })
        );
    }
    //////add reply
    const reply = await intercationServices.addReply(
        mediaKeys,
        text,
        mentionedUserData,
        trends,
        userID,
        tweeetExist.type == 'RETWEET'
            ? tweeetExist.parentInteractionID
            : req.params.id
    );

    req.mentions = mentionedUserData;
    req.interaction = reply;

    res.status(201).send({
        data: { reply, mediaKeys, mentionedUserData, trends },
        status: 'success',
    });
    next();
});

const addLike = catchAsync(async (req, res, next) => {
    //check if the interaction exist
    const checkInteractions = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!checkInteractions || checkInteractions == null) {
        return next(new AppError('no interaction by this id', 404));
    }
    const userID = req.user.id;
    req.interaction = checkInteractions;
    //check if user already like the post
    const isInteractionLiked = await intercationServices.isInteractionLiked(
        userID,
        req.params.id
    );
    if (isInteractionLiked) {
        return next(new AppError('user already like the interaction', 409));
    }

    await intercationServices.addLike(
        userID,
        checkInteractions.type == 'RETWEET'
            ? checkInteractions.parentInteractionID
            : req.params.id
    );
    res.status(201).send({
        status: 'success',
        data: null,
    });
    next();
});
const removeLike = catchAsync(async (req, res, next) => {
    //check if the interaction exist
    const checkInteractions = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!checkInteractions) {
        return next(new AppError('no interaction by this id', 404));
    }
    const userID = req.user.id;
    //check if user already like the post
    const isInteractionLiked = await intercationServices.isInteractionLiked(
        userID,
        req.params.id
    );
    if (!isInteractionLiked) {
        return next(new AppError('User can not unlike this interaction', 409));
    }

    await intercationServices.removeLike(userID, req.params.id);
    return res.status(200).send({
        status: 'success',
        data: null,
    });
});
const getReplies = catchAsync(async (req, res, next) => {
    const interaction = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!interaction) return next(new AppError('no interaction found ', 404));
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    const totalCount = await intercationServices.getRepliesCount(req.params.id);

    offset = Math.min(offset, totalCount);
    const replies = await intercationServices.getReplies(
        req.user.id,
        req.params.id,
        limit,
        offset
    );
    const { data: interactions } = mapInteractions(replies);
    // get pagination results

    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        interactions
    );

    return res.status(200).send({
        status: 'success',
        data: interactions,
        pagination,
    });
});
const createRetweet = catchAsync(async (req, res, next) => {
    const interaction = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!interaction)
        return next(new AppError('no interaction by this id', 404));

    if (interaction.type == 'TWEET' || interaction.type == 'COMMENT')
        interaction.childrenInteractions.map((child) => {
            if (child.type == 'RETWEET' && child.userID == req.user.id)
                return next(new AppError('user already retweeted', 409));
        });
    if (interaction.type == 'RETWEET') {
        const parent = await intercationServices.checkInteractions(
            interaction.parentInteractionID
        );
        parent.childrenInteractions.map((child) => {
            if (child.type == 'RETWEET' && child.userID == req.user.id)
                return next(new AppError('user already retweeted', 409));
        });
    }
    const retweet = await intercationServices.addRetweetToDB(
        req.user.id,
        interaction,
        interaction.type
    );
    req.interaction =
        interaction.type == 'RETWEET'
            ? interaction.parentInteraction
            : interaction;
    res.status(201).send({
        status: 'success',
        data: retweet,
    });
    next();
});
const getRetweeters = catchAsync(async (req, res, next) => {
    const interaction = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!interaction)
        return next(new AppError('no interaction by this id', 404));

    const currentUserID = req.user.id;
    const schema = {
        where: {
            parentInteractionID:
                interaction.type == 'RETWEET'
                    ? interaction.parentInteractionID
                    : interaction.id,
        },
        select: {
            ...userSchema(currentUserID),
        },
        orderBy: {
            createdDate: 'desc', // 'desc' for descending order, 'asc' for ascending order
        },
    };
    const paginationData = await pagination(req, 'Interactions', schema);
    let items = paginationData.data.items;

    let retweeters = items.map((entry) => entry.user);
    retweeters.filter((user) => {
        user.followedByMe = user.followedBy.length > 0;
        user.followsMe = user.following.length > 0;

        // Condition to exclude users
        if (user.blockedBy.length > 0 || user.blocking.length > 0) {
            return false; // Exclude user if the condition is true
        }

        delete user.followedBy;
        delete user.following;
        delete user.blockedBy;
        delete user.blocking;

        return true; // Include user if not excluded
    });

    return res.status(200).send({
        data: { retweeters },
        pagination: paginationData.pagination,
        status: 'success',
    });
});
export default {
    deleteinteraction,
    getLikers,
    createReply,
    addLike,
    removeLike,
    getReplies,
    createRetweet,
    getRetweeters,
};
