import AppError from '../errors/appError.js';
import userService from '../services/userService.js';
import catchAsync from '../utils/catchAsync.js';
import {IsEmail,IsPhoneNumber,IsUsername} from'../utils/inputValidation.js';
import { GenerateToken } from '../utils/generateTokens.js';
const GetAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.GetAllUsers();
    return res.json({ data: users, count: users.length, status: 'success' });
});

const GetUserByEmail = catchAsync(async (req, res, next) => {
    const user = await userService.GetUserByEmail(req.params.email);
    if (!user) {
        return next(new AppError('not user found by this email', 404));
    }
    return res.json({ data: user, status: 'success' });
});

const GetUserById = catchAsync(async (req, res, next) => {
    // const id = Number.parseInt(req.params.id);
    const user = await userService.GetUserById(req.params.id);
    if (!user) {
        return next(new AppError('no user found by this id', 404));
    }
    return res.json({ data: user, status: 'success' });
});
const GetUser=catchAsync(async(req,res,next)=>{
    const identifer=req.body.identifer;
    
    let user;
    if(IsEmail(identifer)){
         user = await userService.FindUserByEmail(identifer,req.body.password);
    }
    else if(IsPhoneNumber(identifer)){
         user = await userService.FindUserByPhone(identifer,req.body.password);
    }
    else if(IsUsername(identifer)) {
         user=await userService.FindUserByUsername(identifer,req.body.password);
    }
    else{
        return next(new AppError('Identifer not valid', 400));
    }

    if (!user) {
        return next(new AppError('no user found ', 404));
    }
    
    const token = JSON.stringify(GenerateToken(user.id));
    res.cookie('token', token, { maxAge: 900000 });
    return res.status(200).send({ data: user, status: 'success' });

});
export { GetAllUsers, GetUserByEmail, GetUserById,GetUser };
