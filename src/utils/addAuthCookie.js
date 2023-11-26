/**
 * Adds an authentication cookie to the response object.
 *
 * @method addAuthCookie
 * @memberof Utils
 * @param {string} token - The authentication token to be stored in the cookie.
 * @param {Object} res - The response object to which the cookie will be added.
 * @returns {Object} - The updated response object with the added cookie.
 *
 * @throws {TypeError} - If the provided 'token' is not a string or 'res' is not an object.
 */

const addAuthCookie = function (token, res) {
    /**
     * Calculate the expiration date for the cookie.
     * @type {Date}
     */
    const cookieExpireDate = new Date(
        Date.now() + process.env.TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    );

    //Set the authentication cookie in the response object.
    res.cookie('token', token, {
        expiresIn: cookieExpireDate,
        httpOnly: true, //cookie cannot be accessed by client side js
    });
    return res;
};
export default addAuthCookie;
