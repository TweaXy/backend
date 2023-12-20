import { catchAsync, handleWrongEmailVerification } from '../../utils/index.js';

const checkEmailVerification = catchAsync(async (req, res, next) => {
    const { email, token } = req.params;
    // check if emailVerificationToken is valid
    await handleWrongEmailVerification(email, token);

    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

export default checkEmailVerification;
