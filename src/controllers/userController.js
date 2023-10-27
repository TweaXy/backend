import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import {
    deleteEmailVerificationToken,
    getEmailVerificationToken,
} from '../services/emailVerificationTokenService.js';
import { generateToken, catchAsync, addAvatar } from '../utils/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const COOKIE_EXPIRES_IN =
    process.env.TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;

const isEmailUnique = catchAsync(async (req, res, next) => {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
        return next(new AppError('email already exists', 409)); //409:conflict
    }
    return res.status(200).send({ status: 'success' });
});

const checkEmailVerification = catchAsync(async (req, res, next) => {
    const { email, emailVerificationToken } = req.body;
    const emailTokenInfo = await getEmailVerificationToken(email);
    // check if there's exist emailVerificationToken
    if (!emailTokenInfo) {
        return next(new AppError('no email request verification found', 404));
    }
    // check if emailVerificationToken not expired
    const expirationDateToken = new Date(
        emailTokenInfo.lastUpdatedAt +
            process.env.VERIFICATION_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000
    );
    if (Date.now() > expirationDateToken) {
        return next(new AppError('Token is expired', 401));
    }
    // check if emailVerificationToken is valid
    const hashedToken = crypto
        .createHash('sha256')
        .update(emailVerificationToken)
        .digest('hex');
    if (hashedToken !== emailTokenInfo.token) {
        return next(new AppError('Token is invalid', 401));
    }
    return next();
});

const createNewUser = catchAsync(async (req, res, next) => {
    const { email, username, name, birthdayDate, password } =req.body;
   
    const usersCount = await userService.getUsersCountByEmailUsername(
        email,
        username
    );
    console.log(usersCount);
    if (usersCount) {
        return next(
            new AppError(
                'there is a user in database with same email or username',
                400
            )
        );
    }

    // get image bytes
    const inputBuffer = req.file ? req.file.buffer : undefined;
    const createdBuffer = await addAvatar(inputBuffer);

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await userService.createNewUser(
        email,
        username,
        name,
        birthdayDate,
        hashedPassword,
        createdBuffer
    );
    if (!user) {
        return next(new AppError('user was not created', 400)); //400:bad request
    }

    // delete email verification token
    await deleteEmailVerificationToken(email);

    const token = generateToken(user.id);

    res.cookie('token', token, {
        expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
        // secure: true, ** only works on https 😛
        httpOnly: true, //cookie cannot be accessed by client side js
    });
    return res.status(200).send({ data: user, status: 'success' });
});
const getUser = catchAsync(async (req, res, next) => {
    const UUID = req.body.UUID;

    const user = await userService.getUserBasicInfoByUUID(UUID);

    if (!user) {
        return next(new AppError('no user found ', 404));
    }

    const token = JSON.stringify(generateToken(user.id));
    res.cookie('token', token, {
        expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
        httpOnly: true, //cookie cannot be accessed by client side js
    });
    return res.status(200).send({ data: user, status: 'success' });
});

const deleteToken = catchAsync(async (req, res, next) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000), //very short time
        httpOnly: true, //cookie cannot be accessed by client side js
    });

    return res.status(200).send({ status: 'success' });
});
export {
    isEmailUnique,
    createNewUser,
    getUser,
    deleteToken,
    checkEmailVerification,
};
