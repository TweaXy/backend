import sendErrorDev from './sendErrorDev.js';
import sendErrorProd from './sendErrorProd.js';

/**
 * handle all errors throwing through app
 * send error message depend on development or production environment
 * @param {AppError} err
 * @param {Response} res
 * @returns {Response}
 */
const globalErrorHandlerMiddleware = (err, req, res, next) => {
    //console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        return sendErrorProd(err, res);
    }
};

export default globalErrorHandlerMiddleware;
