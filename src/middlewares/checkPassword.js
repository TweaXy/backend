import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import bcrypt from 'bcryptjs';

const checkPassword = catchAsync(async (req, res, next) => {
    const password = await userService.getUserPassword(req.user.id);
    if (!(await bcrypt.compare(req.body.oldPassword, password))) {
        return next(
            new AppError('The old password you entered was incorrect.', 401)
        ); //401 :Unauthorized response
    }
    next();
});

export default checkPassword;
