/**
 * send all error information
 * used in dev to debug error
 * @param {AppError} err
 * @param {Response} res
 * @returns {Response}
 */
const sendErrorDev = (err, res) => {
    console.error({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

export default sendErrorDev;
