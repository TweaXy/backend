import sendOperationalErrorProd from './sendOperationalErrorProd.js';

/**
 * send minimal error messages in production and log it
 * @param {AppError} err
 * @param {Response} res
 * @returns {Response}
 */
const sendErrorProd = (err, res) => {
    if (err.isOperationalError) {
        return sendOperationalErrorProd(err, res);
    }
    // programming error, don't leak it to client
    else {
        // log error
        console.error('error 🤯', err);
        // return generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong',
        });
    }
};

export default sendErrorProd;
