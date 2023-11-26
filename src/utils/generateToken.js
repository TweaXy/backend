import jwt from 'jsonwebtoken';

/**
 * Utility function within the Utils namespace for generating a JWT (JSON Web Token) for a user.
 *
 * This function takes a user identifier and generates a JWT using the specified secret and expiration settings.
 *
 * @function generateToken
 * @memberof Utils
 * @param {string} id - The identifier of the user for whom the token is generated.
 * @returns {string} - The generated JSON Web Token.
 *
 * @example
 * // Example usage within the Utils namespace:
 * const userId = '123456789';
 * const generatedToken = Utils.generateToken(userId);
 * // generatedToken will contain the JWT for the specified user identifier.
 */
const generateToken = (id) => {
    const token = jwt.sign({ id: JSON.stringify(id) }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
    });

    return token;
};

export default generateToken;
