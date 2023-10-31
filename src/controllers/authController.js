import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import {
    getEmailVerificationToken,
    updateEmailVerificationToken,
    createEmailVerificationToken,
} from '../services/emailVerificationTokenService.js';

import { setUserResetToken,addTokenToBlacklist } from '../services/authService.js';
import {
    catchAsync,
    sendVerificationEmail,
    sendForgetPasswordEmail,
    createRandomByteToken,
} from '../utils/index.js';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const SendEmailVerification = catchAsync(async (req, res, next) => {
    const resend_afer_milliseconds = process.env.RESEND_AFTER_SECONDS * 1000;
    const { email } = req.body;
    // 1) check if email is not in the user database
    const isUserExists = await userService.checkUserEmailExists(email);

    if (isUserExists) {
        return next(new AppError('Email is already exists and verified', 400));
    }
    // 2) retrieve the emailVerificationToken from the database if exist
    const tokenInfo = await getEmailVerificationToken(email);

    // 3) if exist, check if the token created less than 30 seconds
    if (
        tokenInfo &&
        Date.now() - tokenInfo.lastUpdatedAt < resend_afer_milliseconds
    ) {
        return next(
            new AppError(
                `More than one request in less than ${process.env.RESEND_AFTER_SECONDS} seconds`,
                429
            )
        );
    }
    // 4) create a new token
    const newVerificationToken = createRandomByteToken(4);

    // 5) send email
    await sendVerificationEmail(email, newVerificationToken.token);
    // 4) stored in the emailVerificationTokens database
    if (tokenInfo) {
        await updateEmailVerificationToken(
            email,
            newVerificationToken.encryptedToken
        );
    } else {
        await createEmailVerificationToken(
            email,
            newVerificationToken.encryptedToken
        );
    }
    // 6) return success

    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

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

const resetPassword = catchAsync(async (req, res, next) => {
    const { UUID, token } = req.params;
    const { password } = req.body;

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
    const expirationDateToken = new Date(
        user.ResetTokenCreatedAt +
            process.env.REST_PASS_EXPIRES_IN_HOURS * 60 * 60 * 1000
    );
    if (Date.now() > expirationDateToken) {
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
    // 6) set cookie with jwt token
    const cookieExpireDate = new Date(
        Date.now() + process.env.TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    );
    res.cookie('token', token, {
        expires: cookieExpireDate,
        httpOnly: true, //cookie cannot be accessed by client side js
    });
    // 7) return success with basic user data
    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

const deleteToken = catchAsync(async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    await addTokenToBlacklist(token);
    return res.status(200).send({ status: 'success' });
});
export default { SendEmailVerification, forgetPassword, resetPassword,deleteToken, };
