import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { catchAsync, pagination } from '../../utils/index.js';

const follow = catchAsync(async (req, res, next) => {
    const followingUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUserId = req.user.id;
    const checkFollow = await userService.checkFollow(
        followerUserId,
        followingUser.id
    );
    if (checkFollow) {
        return next(new AppError('user is already followed', 409));
    }
    await userService.follow(followerUserId, followingUser.id);
    return res.status(200).send({ status: 'success' });
});

const unfollow = catchAsync(async (req, res, next) => {
    const followingUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUserId = req.user.id;
    const checkFollow = await userService.checkFollow(
        followerUserId,
        followingUser.id
    );
    if (!checkFollow) {
        return next(new AppError('user is already unfollowed', 409));
    }
    await userService.unfollow(followerUserId, followingUser.id);
    return res.status(200).send({ status: 'success' });
});

const followers = catchAsync(async (req, res, next) => {
    const myId = req.user.id;
    const followingUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const schema = {
        where: {
            followingUserID: followingUser.id,
        },
        select: {
            userID: true,
        },
    };
    const paginationData = await pagination(req, 'follow', schema);

    const followersIds = paginationData.data.items;
    const paginationDetails = {
        itemsNumber: paginationData.pagination.itemsCount,
        nextPage: paginationData.pagination.nextPage,
        prevPage: paginationData.pagination.prevPage,
    };
    const followers = [];
    for (let i = 0; i < followersIds.length; i++) {
        const user = await userService.getUserBasicInfoById(
            followersIds[i].userID
        );
        followers.push(user);
        followers[i].followsMe = await userService.checkFollow(
            followersIds[i].userID,
            myId
        );
        followers[i].followedByMe = await userService.checkFollow(
            myId,
            followersIds[i].userID
        );
    }

    return res.status(200).send({
        data: { followers },
        pagination: paginationDetails,
        status: 'success',
    });
});

const followings = catchAsync(async (req, res, next) => {
    const myId = req.user.id;
    const followerUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!followerUser) {
        return next(new AppError('no user found', 404));
    }
    const schema = {
        where: {
            userID: followerUser.id,
        },
        select: {
            followingUserID: true,
        },
    };
    const paginationData = await pagination(req, 'follow', schema);
    const followingsIds = paginationData.data.items;
    const paginationDetails = {
        itemsNumber: paginationData.pagination.itemsCount,
        nextPage: paginationData.pagination.nextPage,
        prevPage: paginationData.pagination.prevPage,
    };
    const followings = [];
    for (let i = 0; i < followingsIds.length; i++) {
        const user = await userService.getUserBasicInfoById(
            followingsIds[i].followingUserID
        );
        followings.push(user);

        followings[i].followsMe = await userService.checkFollow(
            followingsIds[i].followingUserID,
            myId
        );
        followings[i].followedByMe = await userService.checkFollow(
            myId,
            followingsIds[i].followingUserID
        );
    }

    return res.status(200).send({
        data: { followings },
        pagination: paginationDetails,
        status: 'success',
    });
});

export { follow, unfollow, followers, followings };
