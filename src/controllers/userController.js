import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import { generateToken, catchAsync, addAvatar } from '../utils/index.js';
import bcrypt from 'bcryptjs';

const COOKIE_EXPIRES_IN =
    process.env.TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;

const isEmailUnique = catchAsync(async (req, res, next) => {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
        return next(new AppError('email already exists', 409)); //409:conflict
    }
    return res.send({ status: 'success' });
});

const createNewUser = catchAsync(async (req, res, next) => {
    const inputBuffer = req.file ? req.file.buffer : undefined;
    const createdBuffer = await addAvatar(inputBuffer);

    const { email, username, name, birthdayDate, password } = req.body;

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

    const token = await generateToken(user.id);

    res.cookie('token', token, {
        expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
        // secure: true, ** only works on https 😛
        httpOnly: true, //cookie cannot be accessed by client side js
    });
    return res.send({ data: user, status: 'success' });
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
export { isEmailUnique, createNewUser, getUser, deleteToken };
