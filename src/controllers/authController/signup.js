import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import {
    deleteEmailVerificationToken,
    getEmailVerificationToken,
} from '../../services/emailVerificationTokenService.js';
import {
    generateToken,
    catchAsync,
    checkVerificationTokens,
    addAuthCookie,
} from '../../utils/index.js';
import bcrypt from 'bcryptjs';

const signup = catchAsync(async (req, res, next) => {
    const {
        email,
        username,
        name,
        birthdayDate,
        password,
        emailVerificationToken,
    } = req.body;
    // 1) check if the username, email is valid
    const usersCount = await userService.getUsersCountByEmailUsername(
        email,
        username
    );

    if (usersCount) {
        return next(
            new AppError(
                'there is a user in database with same email or username',
                400
            )
        );
    }
    // 2) check if emailVerificationToken is valid
    const emailTokenInfo = await getEmailVerificationToken(email);
    // check if there's exist emailVerificationToken
    if (!emailTokenInfo) {
        return next(new AppError('no email request verification found', 404));
    }
    // check if emailVerificationToken not expired
    const timeElapsedSinceLastUpdate =
        Date.now() - emailTokenInfo.lastUpdatedAt;
    const tokenExpiryThreshold =
        process.env.VERIFICATION_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000;

    if (timeElapsedSinceLastUpdate > tokenExpiryThreshold) {
        return next(new AppError('Email Verification Code is expired', 401));
    }
    // check if emailVerificationToken is valid
    if (
        !checkVerificationTokens(emailVerificationToken, emailTokenInfo.token)
    ) {
        return next(new AppError('Email Verification Code is invalid', 401));
    }

    // 3) create new user
    const filePath = req.file
        ? 'uploads/' + req.file.filename
        : 'uploads/default.png';

    const hashedPassword = await bcrypt.hash(password, 8);

    let user = await userService.createNewUser(
        email,
        username,
        name,
        birthdayDate,
        hashedPassword,
        filePath
    );
    if (!user) {
        return next(new AppError('user was not created', 400)); //400:bad request
    }

    // delete email verification token
    await deleteEmailVerificationToken(email);

    user = await userService.getUserBasicInfoByUUID(username);

    const token = generateToken(user.id);
    addAuthCookie(token, res);
    return res.status(200).send({ data: { user, token }, status: 'success' });
});

export default signup;
