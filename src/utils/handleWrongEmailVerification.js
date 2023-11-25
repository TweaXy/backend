import AppError from '../errors/appError.js';
import { getEmailVerificationToken } from '../services/emailVerificationTokenService.js';

import { checkVerificationTokens } from './index.js';

const handleWrongEmailVerification = async (email, token) => {
    // 1) check if emailVerificationToken is valid
    const emailTokenInfo = await getEmailVerificationToken(email);
    // check if there's exist emailVerificationToken
    if (!emailTokenInfo) {
        throw new AppError('no email request verification found', 404);
    }
    // check if emailVerificationToken not expired
    const timeElapsedSinceLastUpdate =
        Date.now() - emailTokenInfo.lastUpdatedAt;
    const tokenExpiryThreshold =
        process.env.VERIFICATION_TOKEN_EXPIRES_IN_HOURS * 60 * 60 * 1000;

    if (timeElapsedSinceLastUpdate > tokenExpiryThreshold) {
        throw new AppError('Email Verification Code is expired', 401);
    }
    // check if emailVerificationToken is valid
    if (!checkVerificationTokens(token, emailTokenInfo.token)) {
        throw new AppError('Email Verification Code is invalid', 401);
    }
};

export default handleWrongEmailVerification;
