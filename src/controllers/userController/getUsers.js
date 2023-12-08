import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { catchAsync, pagination } from '../../utils/index.js';

const getUserByID = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
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

export { getUserByID, searchForUsers };
