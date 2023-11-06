import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import { catchAsync, addAuthCookie } from '../../utils/index.js';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const resetPassword = catchAsync(async (req, res, next) => {
    const { UUID, token } = req.params;
    const { password } = req.body;
    const reset_before_milliseconds =
        process.env.REST_PASS_EXPIRES_IN_HOURS * 60 * 60 * 1000;

    // 1) Get user from database using UUID
    const user = await userService.getUserByUUID(UUID, {
        id: true,

        ResetToken: true,
        ResetTokenCreatedAt: true,
    });
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
        return next(new AppError('Token is expired', 401));
    }
    // 4) check if the token is correct
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    if (hashedToken !== user.ResetToken) {
        return next(new AppError('Token is invalid', 401));
    }
    // 5) update the password
    const hashedPassword = await bcrypt.hash(password, 8);
    await userService.updateUserPasswordById(user.id, hashedPassword);

    // 7) return success with basic user data
    addAuthCookie(token, res);

    return res.status(200).json({
        status: 'success',
        data: { token },
    });
});

export default resetPassword;
