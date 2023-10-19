import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import catchAsync from '../utils/catchAsync.js';

const GetAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.GetAllUsers();
    return res.json({ data: users, count: users.length, status: 'success' });
});

const GetUserByEmail = catchAsync(async (req, res, next) => {
    const user = await userService.GetUserByEmail(req.params.email);
    if (!user) {
        return next(new AppError('not user found by this email', 404));
    }
    return res.json({ data: user, status: 'success' });
});

const GetUserById = catchAsync(async (req, res, next) => {
    // const id = Number.parseInt(req.params.id);
    const user = await userService.GetUserById(req.params.id);
    if (!user) {
        return next(new AppError('no user found by this id', 404));
    }
    return res.json({ data: user, status: 'success' });
});

export { GetAllUsers, GetUserByEmail, GetUserById };
