import AppError from '../../errors/appError.js';
import { getEmailVerificationToken } from '../../services/emailVerificationTokenService.js';

import { catchAsync, checkVerificationTokens } from '../../utils/index.js';

const checkEmailVerification = catchAsync(async (req, res, next) => {
    const { email, token } = req.params;
    // 2) check if emailVerificationToken is valid
    const emailTokenInfo = await getEmailVerificationToken(email);
    // check if there's exist emailVerificationToken
    if (!emailTokenInfo) {
        return next(new AppError('no email request verification found', 404));
    }
    // check if emailVerificationToken not expired
    const timeElapsedSinceLastUpdate =
        Date.now() - emailTokenInfo.lastUpdatedAt;
    const tokenExpiryThreshold =
        process.env.VERIFICATION_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000;

    if (timeElapsedSinceLastUpdate > tokenExpiryThreshold) {
        return next(new AppError('Token is expired', 401));
    }
    // check if emailVerificationToken is valid
    if (!checkVerificationTokens(token, emailTokenInfo.token)) {
        return next(new AppError('Token is invalid', 401));
    }

    return res.status(200).json({
        status: 'success',
        data: null,
    });
});

export default checkEmailVerification;
