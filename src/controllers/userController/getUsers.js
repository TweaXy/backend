import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { catchAsync, pagination } from '../../utils/index.js';

const getUserByID = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id, req.user.id);
    if (!user) {
        return next(new AppError('No user found.', 404)); //409:conflict
    }
    return res.status(200).send({ data: { user }, status: 'success' });
});

const searchForUsers = catchAsync(async (req, res, next) => {
    const myId = req.user.id;
    const keyword = req.params.keyword;
    const schema = {
        where: {
            AND: [
                {
                    OR: [
                        { username: { contains: keyword } },
                        { name: { contains: keyword } },
                    ],
                },
                {
                    NOT: { blockedBy: { some: { userID: myId } } },
                },
                {
                    NOT: { mutedBy: { some: { userID: myId } } },
                },
                {
                    NOT: { blocking: { some: { blockingUserID: myId } } },
                },
            ],
        },
        select: {
            id: true,
            username: true,
            name: true,
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
    };

    const paginationData = await pagination(req, 'user', schema);
    let users = paginationData.data.items;

    users.map((user) => {
        user.followedByMe = user.followedBy.length > 0;
        user.followsMe = user.following.length > 0;
        delete user.followedBy;
        delete user.following;
        return user;
    });

    return res.status(200).send({
        data: { users },
        pagination: paginationData.pagination,
        status: 'success',
    });
});

export { getUserByID, searchForUsers };
