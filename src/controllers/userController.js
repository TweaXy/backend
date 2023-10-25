import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import catchAsync from '../utils/catchAsync.js';
import {
    IsEmail,
    IsPhoneNumber,
    IsUsername,
} from '../utils/inputValidation.js';
import { generateToken } from '../utils/generateToken.js';
import addAvatar from '../utils/addAvatar.js';
import bcrypt from 'bcryptjs';

const GetAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.GetAllUsers();
    return res.send({ data: users, count: users.length, status: 'success' });
});

const IsEmailUnique = catchAsync(async (req, res, next) => {
    const user = await userService.GetUserByEmail(req.body.email);
    if (user) {
        return next(new AppError('email already exists', 409)); //409:conflict
    }
    return res.send({ status: 'success' });
});

const CreateNewUser = catchAsync(async (req, res, next) => {
    let inputBuffer;
    if (req.file) {
        inputBuffer = req.file.buffer;
    } else {
        inputBuffer = undefined;
    }
    const createdBuffer = await addAvatar(inputBuffer);
    const data = JSON.parse(req.body.data);
    const hashedPassword = await bcrypt.hash(data.password, 8);

    const user = await userService.CreateNewUser(
        data.email,
        data.username,
        data.name,
        data.birthdayDate,
        hashedPassword,
        createdBuffer
    );
    if (!user) {
        return next(new AppError('user was not created', 400)); //400:bad request
    }

    const token = await generateToken(user.id);
    await userService.AddToken(user.id, token);
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    return res.send({ data: user, status: 'success' });
});
const GetUser = catchAsync(async (req, res, next) => {
    const identifer = req.body.identifer;

    let user;
    if (IsEmail(identifer)) {
        user = await userService.FindUserByEmail(identifer, req.body.password);
    } else if (IsPhoneNumber(identifer)) {
        user = await userService.FindUserByPhone(identifer, req.body.password);
    } else if (IsUsername(identifer)) {
        user = await userService.FindUserByUsername(
            identifer,
            req.body.password
        );
    } else {
        return next(new AppError('Identifer not valid', 400));
    }

    if (!user) {
        return next(new AppError('no user found ', 404));
    }

    const token = JSON.stringify(generateToken(user.id));
    res.cookie('token', token, { maxAge: 900000 });
    return res.status(200).send({ data: user, status: 'success' });
});

const deleteToken = catchAsync(async (req, res, next) => {
    userService.deleteUserByIdAndToken(
        req.userToken.userID,
        req.userToken.token
    );
    return res.send({ status: 'success' });
});
export { GetAllUsers, IsEmailUnique, CreateNewUser, GetUser, deleteToken };
