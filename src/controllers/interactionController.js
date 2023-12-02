import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';
import userService from '../services/userService.js';

import { catchAsync, pagination } from '../utils/index.js';
import { separateMentionsTrends } from '../utils/index.js';

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
    const myId = req.user.id;
    const schema = {
        where: {
            interactionID: req.params.id,
        },
        select: {
            userID: true,
        },
    };
    const paginationData = await pagination(req, 'likes', schema);
    const userIds = paginationData.data.items;
    const paginationDetails = {
        itemsNumber: paginationData.pagination.itemsCount,
        nextPage: paginationData.pagination.nextPage,
        prevPage: paginationData.pagination.prevPage,
    };
    const users = [];
    for (let i = 0; i < userIds.length; i++) {
        const user = await userService.getUserBasicInfoById(userIds[i].userID);
        users.push(user);

        users[i].followsMe = await userService.checkFollow(
            userIds[i].userID,
            myId
        );
        users[i].followedByMe = await userService.checkFollow(
            myId,
            userIds[i].userID
        );
    }

    return res.status(200).send({
        data: { users },
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

    if (!tweeetExist) {
        return next(new AppError('parent interaction not found', 404));
    }

    const { mentions, trends } = separateMentionsTrends(text);
    //check that all mentions are users
    const filteredMentions = await intercationServices.checkMentions(mentions);

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
    return res.status(201).send({
        data: { reply, mentionedUserData, trends },
        status: 'success',
    });
});

const addLike = catchAsync(async (req, res, next) => {
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
    if (isInteractionLiked) {
        return next(new AppError('user already like the interaction', 409));
    }

    await intercationServices.addLike(userID, req.params.id);
    return res.status(201).send({
        status: 'success',
        data: null,
    });
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
