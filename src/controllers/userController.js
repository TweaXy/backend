import AppError from '../errors/appError.js';
import userService from '../services/userService.js';

import {
    deleteEmailVerificationToken,
    getEmailVerificationToken,
} from '../services/emailVerificationTokenService.js';
import {
    generateToken,
    catchAsync,
    checkVerificationTokens,
} from '../utils/index.js';
import bcrypt from 'bcryptjs';

const isEmailUnique = catchAsync(async (req, res, next) => {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
        return next(new AppError('email already exists', 409)); //409:conflict
    }
    return res.status(200).send({ status: 'success' });
});

const isUsernameUnique = catchAsync(async (req, res, next) => {
    const user = await userService.getUserByUsername(req.body.username);
    if (user) {
        return next(new AppError('username already exists', 409)); //409:conflict
    }
    return res.status(200).send({ status: 'success' });
});

const createNewUser = catchAsync(async (req, res, next) => {
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
        return next(new AppError('Token is expired', 401));
    }
    // check if emailVerificationToken is valid
    if (
        !checkVerificationTokens(emailVerificationToken, emailTokenInfo.token)
    ) {
        return next(new AppError('Token is invalid', 401));
    }

    // 3) create new user
    const filePath = req.file
        ? 'uploads/' + req.file.filename
        : 'uploads/default.png';
    console.log(filePath);
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await userService.createNewUser(
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

    const token = JSON.stringify(generateToken(user.id));


    return res.status(200).send({ data: {user,token}, status: 'success' });
});
const getUser = catchAsync(async (req, res, next) => {
    const UUID = req.body.UUID;

    const user = await userService.getUserBasicInfoByUUID(UUID);

    if (!user) {
        return next(new AppError('no user found ', 404));
    }
    const password = await userService.getUserPassword(user.id);
    if (!(await bcrypt.compare(req.body.password, password))) {
        return next(new AppError('wrong password', 401)); //401 :Unauthorized response
    }
    const token = JSON.stringify(generateToken(user.id));
  
    return res.status(200).send({ data: {user,token}, status: 'success' });
});
const doesUUIDExits = catchAsync(async (req, res, next) => {
    const UUID = req.body.UUID;
    const user = await userService.getUserBasicInfoByUUID(UUID);
    if (!user) {
        return next(new AppError('no user found ', 404));
    }
    return res.status(200).send({ status: 'success' });
});

export { isEmailUnique, isUsernameUnique, createNewUser, getUser,doesUUIDExits };
