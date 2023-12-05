import interactionService from '../services/interactionService.js';
import interactionTimelineService from '../services/interactionTimelineService.js';

import {
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
    mapInteractions,
} from '../utils/index.js';

const getUserTimeline = catchAsync(async (req, res, next) => {
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);

    // get total count of interactions followed by the user
    const totalCount =
        await interactionTimelineService.getTimelineInteractionTotalCount(
            req.user.id
        );

    offset = Math.min(offset, totalCount);

    // get interactions followed or created by the user
    const { ids: interactionsID, data: interactions } = mapInteractions(
        await interactionTimelineService.fetchUserTimeline(
            req.user.id,
            limit,
            offset
        )
    );

    // add views to interactions
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
    getUserTimeline,
};
