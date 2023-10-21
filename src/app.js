import express from 'express';
import userRouter from './routes/userRoutes.js';

import swaggerConfig from './config/swaggerConfig.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import morgan from 'morgan';
import AppError from './errors/appError.js';
import globalErrorHandlerMiddleware from './errors/globalErrorHandlerMiddleware.js';

// config swagger
const swaggerSpecs = swaggerJsdoc(swaggerConfig);
const app = express();

app.use(express.json());
// for logging in dev environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// swagger documentation route
app.use(
    '/api/v1/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, { explorer: true })
);

// our main routes
app.use('/api/v1/users', userRouter);

// handle all other routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// handle all errors
app.use(globalErrorHandlerMiddleware);

export default app;
