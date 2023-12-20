import { checkVerificationTokens } from '../utils/index.js';
import userService from '../services/userService.js';

import AppError from '../errors/appError.js';

/**
 * Handles cases of incorrect reset token attempts, checking the validity and expiration of the reset token.
 *
 * @function handleWrongResetToken
 * @memberof Utils
 * @async
 * @param {string} UUID - The unique identifier associated with the user.
 * @param {string} token - The reset token provided by the user for verification.
 * @returns {Object} - The user object if the reset token is valid.
 * @throws {AppError} Throws an AppError with a specific error message and HTTP status code for different error scenarios.
 *
 * @example
 * // Example usage within the Utils namespace:
 * const userUUID = '123456789'; // User's unique identifier
 * const userToken = 'abcdef123456'; // User-provided reset token
 * try {
 *     const user = await handleWrongResetToken(userUUID, userToken);
 *     // Continue with the reset process since the token is valid.
 * } catch (error) {
 *     // Handle the error, e.g., log it or send an appropriate response to the user.
 *     console.error(error.message, error.statusCode);
 * }
 */

const handleWrongResetToken = async (UUID, token) => {
    const reset_before_milliseconds =
        process.env.REST_PASS_EXPIRES_IN_HOURS * 60 * 60 * 1000;

    // 1) Get user from database using UUID
    const user = await userService.getUserByUUID(UUID, {
        id: true,

        ResetToken: true,
        ResetTokenCreatedAt: true,
    });
    //2) check if user exists
    if (!user) {
        throw new AppError('User not found', 404);
    }
    // 2) check if the user has reset token
    if (!user.ResetToken) {
        throw new AppError('User does not have reset token', 401);
    }
    // 3) check if the token is not expired
    if (Date.now() - user.ResetTokenCreatedAt > reset_before_milliseconds) {
        throw new AppError('Reset Code is expired', 401);
    }
    // 4) check if the token is correct
    if (!checkVerificationTokens(token, user.ResetToken)) {
        throw new AppError('Reset Code is invalid', 401);
    }

    return user;
};

export default handleWrongResetToken;
