import AppError from '../errors/appError.js';
import { getEmailVerificationToken } from '../services/emailVerificationTokenService.js';

import { checkVerificationTokens } from './index.js';

/**
 * Handles cases of incorrect email verification attempts, checking the validity and expiration of the verification token.
 *
 * @function handleWrongEmailVerification
 * @memberof Utils
 * @async
 * @param {string} email - The email address associated with the verification token.
 * @param {string} token - The verification token provided by the user for verification.
 * @throws {AppError} Throws an AppError with a specific error message and HTTP status code for different error scenarios.
 * @returns {Promise<void>} - Returns a promise that resolves if the verification is successful; otherwise, it rejects with an error.
 * @example
 * // Example usage within the Utils namespace:
 * const userEmail = 'user@example.com';
 * const userToken = '123456'; // User-provided verification token
 * try {
 *     await handleWrongEmailVerification(userEmail, userToken);
 *     // The function will not throw an error if the verification is successful.
 * } catch (error) {
 *     // Handle the error, e.g., log it or send an appropriate response to the user.
 *     console.error(error.message, error.statusCode);
 * }
 */

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
