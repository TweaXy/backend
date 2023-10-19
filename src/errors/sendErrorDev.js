/**
 * send all error information
 * used in dev to debug error
 * @param {AppError} err
 * @param {Response} res
 * @returns {Response}
 */
const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

export default sendErrorDev;
