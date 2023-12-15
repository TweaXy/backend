import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { catchAsync, pagination } from '../../utils/index.js';

const mute = catchAsync(async (req, res, next) => {
    if (req.params.username == req.user.username)
        return next(new AppError('users can not mute themselves', 403));
    const mutedUser = await userService.getUserByUsername(req.params.username);
    if (!mutedUser) {
        return next(new AppError('no user found', 404));
    }
    const muterUserId = req.user.id;
    const checkFollow = await userService.checkFollow(
        muterUserId,
        mutedUser.id
    );
    if (!checkFollow) {
        return next(new AppError('user is not followed', 403));
    }
    const checkMute = await userService.checkMute(muterUserId, mutedUser.id);
    if (checkMute) {
        return next(new AppError('user is already muted', 409));
    }
    await userService.mute(muterUserId, mutedUser.id);
    return res.status(200).send({ status: 'success' });
});

const unmute = catchAsync(async (req, res, next) => {
    const mutedUser = await userService.getUserByUsername(req.params.username);
    if (!mutedUser) {
        return next(new AppError('no user found', 404));
    }
    const muterUserId = req.user.id;
    const checkFollow = await userService.checkFollow(
        muterUserId,
        mutedUser.id
    );
    if (!checkFollow) {
        return next(new AppError('user is not followed', 403));
    }
    const checkMute = await userService.checkMute(muterUserId, mutedUser.id);

    if (!checkMute) {
        return next(new AppError('user is already unmuted', 409));
    }
    await userService.unmute(muterUserId, mutedUser.id);
    return res.status(200).send({ status: 'success' });
});

const muteList = catchAsync(async (req, res, next) => {
    const myId = req.user.id;
    const schema = {
        where: {
            userID: myId,
        },
        select: {
            mutingUser: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                },
            },
        },
    };

    const paginationData = await pagination(req, 'mutes', schema);
    let items = paginationData.data.items;
    const mutes = items.map((entry) => entry.mutingUser);
    return res.status(200).send({
        data: { mutes },
        pagination: paginationData.pagination,
        status: 'success',
    });
});

export { mute, unmute, muteList };
