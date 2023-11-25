import crypto from 'crypto';

/**
 * Utility function within the Utils namespace for checking the validity of verification tokens.
 *
 * This function compares a provided token with its encrypted version to determine if they match.
 *
 * @function checkVerificationTokens
 * @memberof Utils
 * @param {string} token - The original verification token to be checked.
 * @param {string} encryptedToken - The encrypted version of the verification token for comparison.
 * @returns {boolean} - Returns true if the original token matches its encrypted version; otherwise, false.
 *
 * @example
 * // Example usage within the Utils namespace:
 * const isValid = Utils.checkVerificationTokens('originalToken', 'encryptedToken');
 * // isValid will be true or false based on the comparison result.
 */
export default function checkVerificationTokens(token, encryptedToken) {
    // Encrypt token using SHA-256 algorithm
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // Compare the original token with its encrypted version
    return hashedToken === encryptedToken;
}
