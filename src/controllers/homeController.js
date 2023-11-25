import interactionService from '../services/interactionService.js';

import {
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
} from '../utils/index.js';

const getUserTimeline = catchAsync(async (req, res, next) => {
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    // get total count of interactions followed by the user
    const totalCount =
        await interactionService.getTimelineInteractionTotalCount(req.user.id);

    offset = Math.min(offset, totalCount);

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
