import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import bcrypt from 'bcryptjs';

const checkPassword = catchAsync(async (req, res, next) => {
    const password = await userService.getUserPassword(req.user.id);
    let curretPassword;
    if (req.body.oldPassword) curretPassword = req.body.oldPassword;
    else if (req.body.password) curretPassword = req.body.password;
    else return next(new AppError('  password is required.', 403));
    if (!(await bcrypt.compare(curretPassword, password))) {
        return next(new AppError('wrong password!', 401)); //401 :Unauthorized response
    }
    next();
});

export default checkPassword;
