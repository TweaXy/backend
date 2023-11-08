import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';

import { catchAsync, addAuthCookie, generateToken } from '../../utils/index.js';

import bcrypt from 'bcryptjs';

const login = catchAsync(async (req, res, next) => {
    const UUID = req.body.UUID;

    const user = await userService.getUserBasicInfoByUUID(UUID);

    if (!user) {
        return next(new AppError('no user found ', 404));
    }
    const password = await userService.getUserPassword(user.id);
    if (!(await bcrypt.compare(req.body.password, password))) {
        return next(new AppError('wrong password', 401)); //401 :Unauthorized response
    }
    const token = generateToken(user.id);
    addAuthCookie(token, res);
    return res.status(200).send({ data: { user, token }, status: 'success' });
});

export default login;
