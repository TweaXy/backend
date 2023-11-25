import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import { deleteEmailVerificationToken } from '../../services/emailVerificationTokenService.js';
import {
    generateToken,
    catchAsync,
    addAuthCookie,
    handleWrongEmailVerification,
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
    // check if emailVerificationToken is valid
    await handleWrongEmailVerification(email, emailVerificationToken);

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
