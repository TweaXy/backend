/**
 * catch any errors in async functions and propgate it to globalErrorHandler Middleware
 * @method
 * @param {function} asyncFunction to wrap
 * @returns {function} wrappedFunction to call
 */

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
