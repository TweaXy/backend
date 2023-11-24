import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import { catchAsync, checkVerificationTokens } from '../../utils/index.js';

const checkResetToken = catchAsync(async (req, res, next) => {
    const { email, token } = req.params;
    const reset_before_milliseconds =
        process.env.REST_PASS_EXPIRES_IN_HOURS * 60 * 60 * 1000;

    // 1) Get user from database using UUID
    const user = await userService.getUserByEmail(email);
    //2) check if user exists
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    // 2) check if the user has reset token
    if (!user.ResetToken) {
        return next(new AppError('User does not have reset token', 401));
    }
    // 3) check if the token is not expired
    if (Date.now() - user.ResetTokenCreatedAt > reset_before_milliseconds) {
        return next(new AppError('Reset Code is expired', 401));
    }
    // 4) check if the token is correct
    if (!checkVerificationTokens(token, user.ResetToken)) {
        return next(new AppError('Reset Code is invalid', 401));
    }

    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

export default checkResetToken;
