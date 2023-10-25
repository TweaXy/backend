import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import catchAsync from '../utils/catchAsync.js';
import GenerateToken from '../utils/generateToken.js';
import AddAvatar from '../utils/addAvatar.js'
import bcrypt from 'bcryptjs';



const GetAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.GetAllUsers();
    return res.send({ data: users, count: users.length, status: 'success' });
});

// const GetUserByEmail = catchAsync(async (req, res, next) => {
//     const user = await userService.GetUserByEmail(req.params.email);
//     if (!user) {
//         return next(new AppError('no user found by this email', 404));
//     }
//     return res.json({ data: user, status: 'success' });
// });

// const GetUserById = catchAsync(async (req, res, next) => {
//     const user = await userService.GetUserById(req.params.id);
//     if (!user) {
//         return next(new AppError('no user found by this id', 404));
//     }
//     return res.json({ data: user, status: 'success' });
// });

const IsEmailUnique = catchAsync(async (req, res, next) => {

    const user = await userService.GetUserByEmail(req.body.email);
    if (user) {
        return next(new AppError('email already exists', 409)); //409:conflict
    }
    return res.send({ status: 'success' });
});

const CreateNewUser = catchAsync(async (req, res, next) => {


    const inputBuffer = req.file.buffer;

    const createdBuffer = await AddAvatar(inputBuffer);

    const data = JSON.parse(req.body.data)
    const hashedPassword = await bcrypt.hash(data.password, 8)


    const user = await userService.CreateNewUser(data.email, data.username, data.name, data.birthdayDate, hashedPassword, createdBuffer);
    if (!user) {
        return next(new AppError('user was not created', 400)); //400:bad request
    }

    const token = await GenerateToken(user.id)
    await userService.AddToken(user.id, token);
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    return res.send({ data: user, status: 'success' });
});

export { GetAllUsers, IsEmailUnique, CreateNewUser };
