/**
 * send minimal error message
 * @param {AppError} err
 * @param {Response} res
 * @returns {Response}
 */

const sendOperationalErrorProd = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

export default sendOperationalErrorProd;
