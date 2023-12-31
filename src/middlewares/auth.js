import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import { checkIfTokenIsBlacklisted } from '../services/authService.js';

const auth = catchAsync(async (req, res, next) => {
    let token = null;
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.header('Authorization')) {
        token = req.header('Authorization').replace('Bearer ', '');
    } else {
        return next(new AppError('no token provided', 401));
    }

    if (!token) {
        return next(new AppError('no token provided', 401));
    }
    let decode = null;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError('token not valid', 401));
    }
    // 1) get user id
    const userId = JSON.parse(decode.id);
    // 2) check user existance
    const user = await userService.getUserAllDetailsById(userId);

    if (!user) return next(new AppError('no user found', 404));

    // 3) check if it's exist
    const isBlocked = await checkIfTokenIsBlacklisted(token);
    // token provided?
    if (isBlocked) {
        return next(new AppError('token not valid', 401));
    }

    req.user = user;
    next();
});

export default auth;
