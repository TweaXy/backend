import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import { setUserResetToken } from '../../services/authService.js';
import {
    catchAsync,
    sendForgetPasswordEmail,
    createRandomByteToken,
} from '../../utils/index.js';

const forgetPassword = catchAsync(async (req, res, next) => {
    const resend_afer_milliseconds = process.env.RESEND_AFTER_SECONDS * 1000;
    const { UUID } = req.body;
    // 1) Get user from database using UUID
    const user = await userService.getUserByUUID(UUID, {
        id: true,
        email: true,
        username: true,
        ResetToken: true,
        ResetTokenCreatedAt: true,
    });
    //2) check if user exists
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    // 3) check if there's no request in less than 30 seconds
    if (
        user.ResetToken &&
        user.ResetTokenCreatedAt &&
        Date.now() - user.ResetTokenCreatedAt < resend_afer_milliseconds
    ) {
        return next(
            new AppError(
                `More than one request in less than ${process.env.RESEND_AFTER_SECONDS} seconds`,
                429
            )
        );
    }
    // 4) create a new reset token
    const newResetToken = createRandomByteToken(4);
    // 5) store the new token in the database
    await setUserResetToken(user.id, newResetToken.encryptedToken);
    // 5) send reset token email
    await sendForgetPasswordEmail(
        user.email,
        user.username,
        newResetToken.token
    );

    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

export default forgetPassword;
