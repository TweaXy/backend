import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { catchAsync, pagination } from '../../utils/index.js';

const follow = catchAsync(async (req, res, next) => {
    if (req.params.username == req.user.username)
        return next(new AppError('users can not follow themselves', 403));
    const followingUser = await userService.getUserByUsername(
        req.params.username
    );
    req.follwedUser = followingUser;
    if (!followingUser) {
        return next(new AppError('no user found', 404));
    }
    const followerUserId = req.user.id;
    const checkFollow = await userService.checkFollow(
        followerUserId,
        followingUser.id
    );
    const Blocked = await userService.checkBlock(
        followingUser.id,
        followerUserId
    );

    if (Blocked) {
        return next(new AppError('user can not follow a blocking user', 403));
    }

    const blockedByMe = await userService.checkBlock(
        followerUserId,
        followingUser.id
    );

    if (blockedByMe) {
        return next(new AppError('user can not follow a blocked user', 403));
    }

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
    const Blocked = await userService.checkBlock(followingUser.id, myId);
    if (Blocked) {
        return next(
            new AppError('user can not see followers of a blocking user', 403)
        );
    }
    const schema = {
        where: {
            followingUserID: followingUser.id,
        },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    followedBy: {
                        select: {
                            userID: true,
                        },
                        where: {
                            userID: myId,
                        },
                    },
                    following: {
                        select: {
                            followingUserID: true,
                        },
                        where: {
                            followingUserID: myId,
                        },
                    },
                },
            },
        },
    };

    const paginationData = await pagination(req, 'follow', schema);
    let items = paginationData.data.items;
    let followers = items.map((entry) => entry.user);

    followers.map((user) => {
        user.followedByMe = user.followedBy.length > 0;
        user.followsMe = user.following.length > 0;
        delete user.followedBy;
        delete user.following;
        return user;
    });

    return res.status(200).send({
        data: { followers },
        pagination: paginationData.pagination,
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
    const Blocked = await userService.checkBlock(followerUser.id, myId);
    if (Blocked) {
        return next(
            new AppError('user can not see followings of a blocking user', 403)
        );
    }
    const schema = {
        where: {
            userID: followerUser.id,
        },
        select: {
            followingUser: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    followedBy: {
                        select: {
                            userID: true,
                        },
                        where: {
                            userID: myId,
                        },
                    },
                    following: {
                        select: {
                            followingUserID: true,
                        },
                        where: {
                            followingUserID: myId,
                        },
                    },
                },
            },
        },
    };
    const paginationData = await pagination(req, 'follow', schema);
    let items = paginationData.data.items;
    let followings = items.map((entry) => entry.followingUser);

    followings.map((user) => {
        user.followedByMe = user.followedBy.length > 0;
        user.followsMe = user.following.length > 0;
        delete user.followedBy;
        delete user.following;
        return user;
    });
    return res.status(200).send({
        data: { followings },
        pagination: paginationData.pagination,
        status: 'success',
    });
});

export { follow, unfollow, followers, followings };
