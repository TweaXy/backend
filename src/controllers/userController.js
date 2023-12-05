import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import { deleteEmailVerificationToken } from '../services/emailVerificationTokenService.js';
import {
    catchAsync,
    pagination,
    handleWrongEmailVerification,
} from '../utils/index.js';
import bcrypt from 'bcryptjs';

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
    const followingUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUser = req.user;
    const checkFollow = await userService.checkFollow(
        followerUser.id,
        followingUser.id
    );
    if (checkFollow) {
        return next(new AppError('user is already followed', 409));
    }
    await userService.follow(followerUser.id, followingUser.id);
    return res.status(200).send({ status: 'success' });
});

const unfollow = catchAsync(async (req, res, next) => {
    const followingUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUser = req.user;
    const checkFollow = await userService.checkFollow(
        followerUser.id,
        followingUser.id
    );
    if (!checkFollow) {
        return next(new AppError('user is already unfollowed', 409));
    }
    await userService.unfollow(followerUser.id, followingUser.id);
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

const deleteProfileBanner = catchAsync(async (req, res, next) => {
    if (req.user.cover == null)
        return next(new AppError('cover picture does not exist', 409));
    await userService.deleteProfileBanner(req.user.id);
    return res.status(200).send({ status: 'success' });
});

const deleteProfilePicture = catchAsync(async (req, res, next) => {
    if (req.user.avatar == 'uploads/default.png' || req.user.avatar == null)
        return next(new AppError('avatar picture does not exist', 409));
    await userService.deleteProfilePicture(req.user.id);
    return res.status(200).send({ status: 'success' });
});

const updateProfile = catchAsync(async (req, res, next) => {
    const updates = Object.keys(req.body);

    if (updates.length == 0 && !req.files)
        return next(new AppError('no body', 400));

    const validUpdates = [
        'name',
        'phone',
        'birthdayDate',
        'bio',
        'location',
        'avatar',
        'cover',
        'website',
        'username',
    ];

    const isValid = updates.every((update) => {
        return validUpdates.includes(update);
    });

    if (!isValid) {
        return next(new AppError('not valid body', 400));
    }

    let data = req.body;
    if (req.files['avatar'])
        data.avatar = req.files['avatar'] =
            'uploads/' + req.files['avatar'][0].filename;

    if (req.files['cover'])
        data.cover = req.files['cover'] =
            'uploads/' + req.files['cover'][0].filename;

    await userService.updateProfile(data, req.user.id);
    return res.status(200).send({ status: 'success' });
});

const updateUserName = catchAsync(async (req, res, next) => {
    const email = '';
    const userNameCount = await userService.getUsersCountByEmailUsername(
        email,
        req.body.username
    );

    if (userNameCount > 0)
        return next(new AppError('username already exists', 409)); //409:confli

    await userService.updateProfile(req.body, req.user.id);
    return res.status(200).send({ status: 'success' });
});

const searchForUsers = catchAsync(async (req, res, next) => {
    const myId = req.user.id;
    const keyword = req.params.keyword;
    const schema = {
        where: {
            OR: [
                {
                    username: {
                        contains: keyword,
                    },
                },
                {
                    name: {
                        contains: keyword,
                    },
                },
            ],
        },
        select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
        },
    };

    const paginationData = await pagination(req, 'user', schema);
    const users = paginationData.data.items;
    const paginationDetails = {
        itemsNumber: paginationData.pagination.itemsCount,
        nextPage: paginationData.pagination.nextPage,
        prevPage: paginationData.pagination.prevPage,
    };

    for (let i = 0; i < users.length; i++) {
        users[i].followsMe = await userService.checkFollow(users[i].id, myId);
        users[i].followedByMe = await userService.checkFollow(
            myId,
            users[i].id
        );
    }

    return res.status(200).send({
        data: { users },
        pagination: paginationDetails,
        status: 'success',
    });
});

const updatePassword = catchAsync(async (req, res, next) => {
    if (req.body.newPassword === req.body.oldPassword)
        return next(
            new AppError(
                'new password must be different from old password',
                400
            )
        ); //400:bad requist

    if (req.body.newPassword != req.body.confirmPassword)
        return next(
            new AppError(
                'new password does not match with confirm password',
                400
            )
        ); //400:bad requist

    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);
    await userService.updateUserPasswordById(req.user.id, hashedNewPassword);
    return res.status(200).send({ status: 'success' });
});

const checkPasswordController = catchAsync(async (req, res, next) => {
    return res.status(200).send({ status: 'success' });
});

const updateEmail = catchAsync(async (req, res, next) => {
    await handleWrongEmailVerification(req.body.email, req.body.token);
    await deleteEmailVerificationToken(req.body.email);
    await userService.updateUserEmailById(req.user.id, req.body.email);
    return res.status(200).send({ status: 'success' });
});

export {
    isEmailUnique,
    isUsernameUnique,
    getUserByID,
    doesUUIDExits,
    follow,
    unfollow,
    deleteProfileBanner,
    deleteProfilePicture,
    updateProfile,
    followers,
    followings,
    updateUserName,
    searchForUsers,
    updatePassword,
    checkPasswordController,
    updateEmail,
};
