import crypto from 'crypto';

/**
 * Utility function within the Utils namespace for generating a random byte token and its encrypted version.
 *
 * This function creates a random byte token of a specified length and returns both the original token
 * and its encrypted version for secure storage or comparison.
 *
 * @function createRandomByteToken
 * @memberof Utils
 * @param {number} [byteLength=32] - The length of the random byte token. Defaults to 32 bytes.
 * @returns {Object} - An object containing the original token and its encrypted version.
 * @property {string} token - The original random byte token.
 * @property {string} encryptedToken - The encrypted version of the random byte token.
 *
 * @example
 * // Example usage within the Utils namespace:
 * const { token, encryptedToken } = Utils.createRandomByteToken(64);
 * // token and encryptedToken will contain the generated values.
 */
export default function createRandomByteToken(byteLength = 32) {
    const token = crypto.randomBytes(byteLength).toString('hex');
    // encrypt token
    const encryptedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    return { token, encryptedToken };
}
