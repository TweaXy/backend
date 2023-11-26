/**
 * Checks if the provided identifier is a valid UUID, email address, or phone number.
 *
 * @function isUUID
 * @memberof Utils
 * @param {string} UUID - The user identifier to check.
 * @returns {boolean} - True if the identifier is a valid UUID, email address, or phone number; otherwise, false.
 *
 * @example
 * const isValidIdentifier = isUUID('user@example.com');
 * // Returns true if 'user@example.com' is a valid UUID, email address, or phone number; otherwise, returns false.
 */
export default function isUUID(UUID) {
    /**
     * @type {RegExp} emailPattern
     * The regular expression pattern for validating an email address.
     */
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    /**
     * @type {RegExp} phonePattern
     * The regular expression pattern for validating a phone number.
     */
    const phonePattern = /^[0-9]+$/;

    // Check if the identifier matches the email or phone pattern
    if (emailPattern.test(UUID) || phonePattern.test(UUID)) return true;

    // Check if the identifier is a string and has a valid length for a UUID
    if (typeof UUID === 'string' && UUID.length >= 4 && UUID.length <= 191)
        return true;

    // If none of the conditions are met, return false
    return false;
}
