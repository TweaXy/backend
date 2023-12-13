import {
    getTweetsProfileCount,
    getTweetsProfile,
    getLikesProfileCount,
    getLikesProfile,
    getMentionsProfileCount,
    getMentionsProfile
} from '../services/profileService.js';
import userService from '../services/userService.js';
import AppError from '../errors/appError.js';
import {
    catchAsync,
    getOffsetAndLimit,
    calcualtePaginationData,
    mapInteractions,
} from '../utils/index.js';

const profileTweets = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new AppError('no user found ', 404));
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    // get total count of interactions followed by the user
    const totalCount = await getTweetsProfileCount(req.params.id);
    offset = Math.min(offset, totalCount);

    const tweets = await getTweetsProfile(
        req.user.id,
        req.params.id,
        offset,
        limit
    );

    const {  data: interactions } = mapInteractions(tweets);
    
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

const  profileLikes= catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new AppError('no user found ', 404));
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    // get total count of interactions followed by the user
    const totalCount = await getLikesProfileCount(req.params.id);
    offset = Math.min(offset, totalCount);

    const likes = await getLikesProfile(
        req.user.id,
        req.params.id,
        offset,
        limit
    );
    const { data: interactions } = mapInteractions(likes);
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



const profileMentions= catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return next(new AppError('no user found ', 404));
    // get offset and limit from request query
    let { offset, limit } = getOffsetAndLimit(req);
    // get total count of interactions followed by the user
    const totalCount = await getMentionsProfileCount(req.params.id);
    offset = Math.min(offset, totalCount);

    const mentions = await getMentionsProfile(
        req.user.id,
        req.params.id,
        offset,
        limit
    );
    const { data: interactions } = mapInteractions(mentions);
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

export { profileTweets, profileLikes ,profileMentions};
