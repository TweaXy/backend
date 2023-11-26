/**
 * Utility function within the Utils namespace for constructing the full URL from an Express request object.
 *
 * This function extracts the relevant parts of the request object (protocol, host, base URL, and extended URL)
 * to create the complete URL.
 *
 * @function getFullUrl
 * @memberof Utils
 * @param {Object} req - The Express request object.
 * @returns {string} - The full URL constructed from the request object.
 *
 * @example
 * // Example usage within the Utils namespace:
 * const fullUrl = Utils.getFullUrl(req);
 * // fullUrl will contain the complete URL based on the request object.
 * // fullU eg: http://localhost:3000/api/v1/users
 */

const getFullUrl = (req) => {
    const extendedUrl = req.url.split('?')[0];

    return `${req.protocol}://${req.get('host')}${req.baseUrl}${extendedUrl}`;
};

export default getFullUrl;
