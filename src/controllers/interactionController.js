import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';
import userService from '../services/userService.js';

import { catchAsync, pagination } from '../utils/index.js';

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
export default { deleteinteraction, getLikers };
