import { checkVerificationTokens } from '../utils/index.js';
import userService from '../services/userService.js';

import AppError from '../errors/appError.js';

const handleWrongResetToken = async (UUID, token) => {
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
        throw new AppError('User not found', 404);
    }
    // 2) check if the user has reset token
    if (!user.ResetToken) {
        throw new AppError('User does not have reset token', 401);
    }
    // 3) check if the token is not expired
    if (Date.now() - user.ResetTokenCreatedAt > reset_before_milliseconds) {
        throw new AppError('Reset Code is expired', 401);
    }
    // 4) check if the token is correct
    if (!checkVerificationTokens(token, user.ResetToken)) {
        throw new AppError('Reset Code is invalid', 401);
    }

    return user;
};

export default handleWrongResetToken;
