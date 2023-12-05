import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import { deleteEmailVerificationToken } from '../../services/emailVerificationTokenService.js';
import {
    generateToken,
    catchAsync,
    addAuthCookie,
    handleWrongEmailVerification,
    generateUsername,
} from '../../utils/index.js';
import bcrypt from 'bcryptjs';

const signup = catchAsync(async (req, res, next) => {
    const { email, name, birthdayDate, password, emailVerificationToken } =
        req.body;
    let username = '';
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
    // check if emailVerificationToken is valid
    await handleWrongEmailVerification(email, emailVerificationToken);

    // 3) create new user
    const filePath = 'uploads/default.png';

    let isUnique = false;

    while (!isUnique) {
        username = generateUsername(email);
        let user = await userService.getUserByUsername(username);
        if (!user) isUnique = true;
    }

    const validUsername = username.replace(/[^a-zA-Z0-9_]/g, '');

    const hashedPassword = await bcrypt.hash(password, 8);

    let user = await userService.createNewUser(
        email,
        validUsername,
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

    user = await userService.getUserBasicInfoByUUID(validUsername);

    const token = generateToken(user.id);
    addAuthCookie(token, res);
    return res.status(200).send({ data: { user, token }, status: 'success' });
});

export default signup;
