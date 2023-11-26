import { catchAsync, handleWrongResetToken } from '../../utils/index.js';

const checkResetToken = catchAsync(async (req, res, next) => {
    const { email, token } = req.params;

    handleWrongResetToken(email, token);

    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

export default checkResetToken;
