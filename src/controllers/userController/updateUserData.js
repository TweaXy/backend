import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { deleteEmailVerificationToken } from '../../services/emailVerificationTokenService.js';
import { catchAsync, handleWrongEmailVerification } from '../../utils/index.js';
import { uploadFile, deleteFile } from '../../utils/aws.js';
import bcrypt from 'bcryptjs';

import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

const deleteProfileBanner = catchAsync(async (req, res, next) => {
    if (req.user.cover == null)
        return next(new AppError('cover picture does not exist', 409));
    await deleteFile(req.user.cover);
    await userService.deleteProfileBanner(req.user.id);
    return res.status(200).send({ status: 'success' });
});

const deleteProfilePicture = catchAsync(async (req, res, next) => {
    if (req.user.avatar == process.env.DEFAULT_KEY || req.user.avatar == null)
        return next(new AppError('avatar picture does not exist', 409));
    await deleteFile(req.user.avatar);
    await userService.deleteProfilePicture(req.user.id);
    return res.status(200).send({ status: 'success' });
});

const updateProfile = catchAsync(async (req, res, next) => {
    const updates = Object.keys(req.body);

    if (updates.length == 0 && !req.files)
        return next(new AppError('no body', 400));

    const validUpdates = [
        'name',
        'phone',
        'birthdayDate',
        'bio',
        'location',
        'avatar',
        'cover',
        'website',
        'username',
    ];

    const isValid = updates.every((update) => {
        return validUpdates.includes(update);
    });

    if (req.phone)
    {
        const phoneCount = await userService.checkUserPhoneExists(req.phone);
        if (phoneCount)
            return next(new AppError('phone aleady exist', 409));
    }

    if (!isValid) {
        return next(new AppError('not valid body', 400));
    }

    let data = req.body;
    if (req.files['avatar']) {
        const avatarKey = await uploadFile(req.files['avatar'][0]);
        data.avatar = avatarKey;
        await unlinkFile(req.files['avatar'][0].path);
    }

    if (req.files['cover']) {
        const coverKey = await uploadFile(req.files['cover'][0]);
        data.cover = coverKey;
        await unlinkFile(req.files['cover'][0].path);
    }

    await userService.updateProfile(data, req.user.id);
    return res.status(200).send({ status: 'success' });
});

const updateUserName = catchAsync(async (req, res, next) => {
    const email = '';
    const userNameCount = await userService.getUsersCountByEmailUsername(
        email,
        req.body.username
    );

    if (userNameCount > 0)
        return next(new AppError('Username already exists!', 409)); //409:confli

    await userService.updateProfile(req.body, req.user.id);
    return res.status(200).send({ status: 'success' });
});

const updatePassword = catchAsync(async (req, res, next) => {
    if (req.body.newPassword === req.body.oldPassword)
        return next(
            new AppError(
                'new password must be different from old password',
                400
            )
        ); //400:bad requist

    if (req.body.newPassword != req.body.confirmPassword)
        return next(
            new AppError(
                'new password does not match with confirm password',
                400
            )
        ); //400:bad requist

    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 8);
    await userService.updateUserPasswordById(req.user.id, hashedNewPassword);
    return res.status(200).send({ status: 'success' });
});

const updateEmail = catchAsync(async (req, res, next) => {
    await handleWrongEmailVerification(req.body.email, req.body.token);
    await deleteEmailVerificationToken(req.body.email);
    await userService.updateUserEmailById(req.user.id, req.body.email);
    return res.status(200).send({ status: 'success' });
});

export {
    deleteProfileBanner,
    deleteProfilePicture,
    updateProfile,
    updateUserName,
    updatePassword,
    updateEmail,
};
