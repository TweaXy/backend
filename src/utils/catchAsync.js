/**
 * Utility functions for handling asynchronous operations in an Express application.
 *
 * @namespace Utils.AsyncUtils
 */

/**
 * Wraps an asynchronous function to catch any errors and propagate them to the globalErrorHandler middleware.
 *
 * @method catchAsync
 * @param {function} asyncFunction - The asynchronous function to wrap.
 * @memberof Utils.AsyncUtils
 * @returns {function} wrappedFunction - A function that can be called with Express request, response, and next parameters.
 * @throws {Error} - Propagates any errors encountered in the asynchronous function to the global error handler middleware.
 */
const catchAsync = (asyncFunction) => {
    /**
     * @method wrappedFunction
     * @memberof Utils.AsyncUtils
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {function} next - Express next function.
     */
    return (req, res, next) => {
        asyncFunction(req, res, next).catch(next);
    };
};

export default catchAsync;
