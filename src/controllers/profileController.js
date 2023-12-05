import TimelineService from '../services/interactionTimelineService.js';
import {
    getTweetsProfileCount,
    getTweetsProfile,
    getLikesProfileCount,
    getLikesProfile,
} from '../services/profileService.js';
import userService from '../services/userService.js';
import AppError from '../errors/appError.js';
import {
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
} from '../utils/index.js';

const profileTweets = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new AppError('no user found ', 404));
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    // get total count of interactions followed by the user
    const totalCount = await getTweetsProfileCount(req.params.id);
    offset = Math.min(offset, totalCount);

    const tweets = await getTweetsProfile(req.params.id, offset, limit);
    const mapedTweets = TimelineService.mapInteractions(tweets);

    // get pagination results
    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        mapedTweets
    );

    return res.json({
        status: 'success',
        data: { items: mapedTweets },
        pagination,
    });
});

const profileLikes = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new AppError('no user found ', 404));
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    // get total count of interactions followed by the user
    const totalCount = await getLikesProfileCount(req.params.id);
    offset = Math.min(offset, totalCount);

    const likes = await getLikesProfile(req.params.id, offset, limit);
    const mapedLikes = TimelineService.mapInteractions(likes);

    // get pagination results
    const pagination = calcualtePaginationData(
        req,
        offset,
        limit,
        totalCount,
        mapedLikes
    );

    return res.json({
        status: 'success',
        data: { items: mapedLikes },
        pagination,
    });
});

export { profileTweets, profileLikes };
