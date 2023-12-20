import trendService from '../services/trendService.js';
import interactionService from '../services/interactionService.js';
import {
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
    mapInteractions,
} from '../utils/index.js';

const getTrends = catchAsync(async (req, res, next) => {
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);

    // get total count of interactions followed by the user
    const totalCount = await trendService.getTrendsTotalCount();

    offset = Math.min(offset, totalCount);

    // get interactions followed or created by the user
    const trends = await trendService.getTrendsSorted(limit, offset);

    // get pagination results
    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        trends
    );

    return res.json({
        status: 'success',
        data: { items: trends },
        pagination,
    });
});

const getTrendInteractions = catchAsync(async (req, res, next) => {
    // get offset and limit from request query
    const { trend } = req.params;
    let { offset, limit } = getOffsetAndLimit(req);

    // get total count of interactions followed by the user
    const totalCount = await trendService.getTrendsInteractionTotalCount(trend);

    offset = Math.min(offset, totalCount);
    // get interactions followed or created by the user
    const { ids: interactionsID, data: interactions } = mapInteractions(
        await trendService.getTrendInteractions(
            trend,
            req.user.id,
            limit,
            offset
        )
    );

    await interactionService.viewInteractions(req.user.id, interactionsID);
    // get pagination results
    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        interactions
    );

    return res.json({
        status: 'success',
        data: { items: interactions },
        pagination,
    });
});

export default {
    getTrends,
    getTrendInteractions,
};
