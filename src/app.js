import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

import AppError from './errors/appError.js';
import globalErrorHandlerMiddleware from './errors/globalErrorHandlerMiddleware.js';

import conversationsRouter from './routes/conversationsRoutes.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

BigInt.prototype.toJSON = function () {
    return Number(this);
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(dirname, '../uploads')));
// for logging in dev environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// our main routes
app.use('/api/v1/conversations', conversationsRouter);

// handle all other routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// handle all errors
app.use(globalErrorHandlerMiddleware);

export default app;
