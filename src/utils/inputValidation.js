/**
 * Namespace for utility functions related to input validation.
 *
 * @namespace Utils.inputValidation
 */

/**
 * Checks if the provided identifier is a valid email address.
 *
 * @function IsEmail
 * @memberof Utils.inputValidation
 * @param {string} identifier - The user identifier to check.
 * @returns {boolean} - Returns true if the identifier is a valid email address (comprising a sequence of letters, followed by '@', then another sequence of letters, '.', and at least two more letters), otherwise returns false.
 * @example
 * const isEmail = IsEmail('user@example.com');
 */
const IsEmail = (input) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(input);
};

/**
 * Checks if the provided identifier is a valid phone number.
 *
 * @function IsPhoneNumber
 * @memberof Utils.inputValidation
 * @param {string} identifier - The user identifier to check.
 * @returns {boolean} - True if the identifier is a valid phone number (exact 11 digits), otherwise false.
 *
 * @example
 * const isPhoneNumber = Utils.IsPhoneNumber('12345678901');
 */
const IsPhoneNumber = (input) => {
    const phonePattern = /^\d{11}$/;
    return phonePattern.test(input);
};

/**
 * Checks if the provided identifier is a valid username.
 *
 * @function IsUsername
 * @memberof Utils.inputValidation
 * @param {string} identifier - The user identifier to check.
 * @returns {boolean} - True if the identifier is a valid username (must have one or more characters), otherwise false.
 *
 * @example
 * const isUsername = Utils.IsUsername('user123');
 */
const IsUsername = (input) => {
    const usernamePattern = /^[A-Za-z0-9_-]+$/;
    return usernamePattern.test(input);
};

export { IsEmail, IsPhoneNumber, IsUsername };
