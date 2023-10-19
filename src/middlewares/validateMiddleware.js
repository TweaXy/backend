import AppError from '../errors/appError.js';

const validateMiddleware = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        next(new AppError(error.message, 403));
    }
};

export default validateMiddleware;
