import AppError from '../../errors/appError.js';
import userService from '../../services/userService.js';
import { catchAsync } from '../../utils/index.js';

const block = catchAsync(async (req, res, next) => {
    const blockedUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!blockedUser) {
        return next(new AppError('no user found', 404));
    }
    const blockerUserId = req.user.id;
    const checkBlock = await userService.checkBlock(
        blockerUserId,
        blockedUser.id
    );
    if (checkBlock) {
        return next(new AppError('user is already blocked', 409));
    }
    await userService.block(blockerUserId, blockedUser.id);
    return res.status(200).send({ status: 'success' });
});

const unblock = catchAsync(async (req, res, next) => {
    const blockedUser = await userService.getUserByUsername(
        req.params.username
    );
    if (!blockedUser) {
        return next(new AppError('no user found', 404));
    }
    const blockerUserId = req.user.id;
    const checkBlock = await userService.checkBlock(
        blockerUserId,
        blockedUser.id
    );
    if (!checkBlock) {
        return next(new AppError('user is already unblocked', 409));
    }
    await userService.unblock(blockerUserId, blockedUser.id);
    return res.status(200).send({ status: 'success' });
});



export { block,unblock};
