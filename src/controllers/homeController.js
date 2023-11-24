import AppError from '../errors/appError.js';
import prisma from '../prisma.js';
import interactionService from '../services/interactionService.js';

import {
    catchAsync,
    getOffsetAndLimit,
    handleOffsetError,
    calcualtePaginationData,
} from '../utils/index.js';

const getUserTimeline = catchAsync(async (req, res, next) => {
    const { offset, limit } = getOffsetAndLimit(req);
    const totalCount = await prisma.interactions.count({
        where: {
            user: {
                followedBy: {
                    some: {
                        userID: req.user.id,
                    },
                },
            },
        },
    });

    if (totalCount === 0) {
        return res.json({
            data: { items: [] },
            pagination: {
                totalCount: 0,
                itemsNumber: 0,
                nextPage: null,
                prevPage: null,
            },
        });
    }

    handleOffsetError(offset, totalCount);

    const { ids: interactionsID, data: interactions } =
        await interactionService.getUserTimeline(req.user.id, limit, offset);

    await interactionService.viewInteractions(req.user.id, interactionsID);

    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        interactions
    );
    return res.json({ data: { items: interactions }, pagination });
});

export default {
    getUserTimeline,
};
