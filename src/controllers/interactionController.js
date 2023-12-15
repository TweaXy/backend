import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';

import { catchAsync, pagination } from '../utils/index.js';
import { separateMentionsTrends } from '../utils/index.js';
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
    const items = paginationData.data.items;
    items.map((item) => {
        item.user.followedByMe = item.user.followedBy.length > 0;
        item.user.followsMe = item.user.following.length > 0;
        delete item.user.followedBy;
        delete item.user.following;
        return item;
    });
    // const userIds = paginationData.data.items;
    const paginationDetails = {
        itemsNumber: paginationData.pagination.itemsCount,
        nextPage: paginationData.pagination.nextPage,
        prevPage: paginationData.pagination.prevPage,
    };

    return res.status(200).send({
        data: { users: items },
        pagination: paginationDetails,
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
    const filteredMentions = await intercationServices.checkMentions(mentions);

    /////upload medio on S3
    if (req.files) {
        await uploadMultipleFile(req.files);

        await Promise.all(
            req.files.map(async (file) => {
                await unlinkFile(file.path);
            })
        );
    }

    //////add reply
    const reply = await intercationServices.addReply(
        req.files,
        text,
        filteredMentions,
        trends,
        userID,
        req.params.id
    );
    const mentionedUserData = filteredMentions.map((mention) => ({
        id: mention.id,
        username: mention.username,
        name: mention.name,
        email: mention.email,
    }));

  req.mentions = mentionedUserData;
    req.interaction = reply;
    const media = !req.files ? [] : req.files.map((file) => file.filename);

    return res.status(201).send({
        data: { reply, media, mentionedUserData, trends },
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

    await intercationServices.addLike(userID, req.params.id);
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
export default {
    deleteinteraction,
    getLikers,
    createReply,
    addLike,
    removeLike,
};
