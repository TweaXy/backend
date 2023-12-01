import trendService from '../services/trendService.js';

import {
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
} from '../utils/index.js';

const getTrendInteractions = catchAsync(async (req, res, next) => {
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

export default {
    getTrendInteractions,
};
