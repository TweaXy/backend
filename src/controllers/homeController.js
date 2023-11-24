import AppError from '../errors/appError.js';
import interactionService from '../services/interactionService.js';

import { catchAsync } from '../utils/index.js';

const getUserTimeline = catchAsync(async (req, res, next) => {
    const { offset, limit } = req.query;
    return res.json({ offset, limit });
});

export default {
    getUserTimeline,
};
