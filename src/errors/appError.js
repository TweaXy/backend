class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        // request fail if it start with 400
        // request error if it start with 500
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // not programming error
        this.isOperationalError = true;

        // so when printing stack error wont add this class & it's parent
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
