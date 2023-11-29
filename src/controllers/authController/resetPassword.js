import userService from '../../services/userService.js';

import {
    catchAsync,
    addAuthCookie,
    handleWrongResetToken,
    generateToken,
} from '../../utils/index.js';

import bcrypt from 'bcryptjs';

const resetPassword = catchAsync(async (req, res, next) => {
    const { UUID, token } = req.params;
    const { password } = req.body;
    // 1)  get user and handle wrong reset token
    const user = await handleWrongResetToken(UUID, token);

    // 2) update the password
    const hashedPassword = await bcrypt.hash(password, 8);
    await userService.updateUserPasswordById(user.id, hashedPassword);

    // 7) return success with basic user data
    const userToken = generateToken(user.id);
    addAuthCookie(userToken, res);

    return res.status(200).json({
        status: 'success',
        data: { token: userToken },
    });
});

export default resetPassword;
