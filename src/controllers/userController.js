import AppError from '../errors/appError.js';
import prisma from '../prisma.js';
import userService from '../services/userService.js';

import { catchAsync } from '../utils/index.js';

const isEmailUnique = catchAsync(async (req, res, next) => {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
        return next(new AppError('email already exists', 409)); //409:conflict
    }
    return res.status(200).send({ status: 'success' });
});

const isUsernameUnique = catchAsync(async (req, res, next) => {
    const user = await userService.getUserByUsername(req.body.username);
    if (user) {
        return next(new AppError('username already exists', 409)); //409:conflict
    }
    return res.status(200).send({ status: 'success' });
});

const doesUUIDExits = catchAsync(async (req, res, next) => {
    const UUID = req.body.UUID;
    const user = await userService.getUserBasicInfoByUUID(UUID);
    if (!user) {
        return next(new AppError('no user found ', 404));
    }
    return res.status(200).send({ status: 'success' });
});


const getUserByID = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
        return next(new AppError('no user found', 404)); //409:conflict
    }
    return res.status(200).send({ data: { user }, status: 'success' });
});
const follow = catchAsync(async (req, res, next) => {
    const followingUser = await userService.getUserByUsername(req.params.username);
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUser = req.user;
    const checkFollow = await userService.checkFollow(followerUser.id, followingUser.id);
    if (checkFollow) {
        return next(new AppError('user is already followed', 409));

    }
    await userService.follow(followerUser.id, followingUser.id);
    return res.status(200).send({ status: 'success' });
});

const unfollow = catchAsync(async (req, res, next) => {
    const followingUser = await userService.getUserByUsername(req.params.username);
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUser = req.user;
    const checkFollow = await userService.checkFollow(followerUser.id, followingUser.id);
    if (!checkFollow) {
        return next(new AppError('user is already unfollowed', 409));

    }
    await userService.unfollow(followerUser.id, followingUser.id);
    return res.status(200).send({ status: 'success' });
});


const deleteProfileBanner = catchAsync(async (req, res, next) => {
    console.log(req.user);
    userService.deleteProfileBanner(req.user.id);
    return res.status(200).send({ status: 'success' });
});

const deleteProfilePicture = catchAsync(async (req, res, next) => {
    userService.deleteProfilePicture(req.user.id);
    return res.status(200).send({ status: 'success' });
});

export { isEmailUnique, isUsernameUnique, getUserByID, doesUUIDExits, follow, unfollow, deleteProfileBanner, deleteProfilePicture };
