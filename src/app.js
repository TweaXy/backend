import express from 'express';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import tweetRouter from './routes/tweetRouts.js';
import trendRouter from './routes/trendRoutes.js';
import interactionRouter from './routes/interactionRoutes.js';
import homeRouter from './routes/homeRoutes.js';

import swaggerConfig from './config/swaggerConfig.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import morgan from 'morgan';
import AppError from './errors/appError.js';
import globalErrorHandlerMiddleware from './errors/globalErrorHandlerMiddleware.js';

import cookieParser from 'cookie-parser';

import passport from 'passport';

import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

import serviceAccount from './config/serviceAccoumtKeyFirebase.js';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});




BigInt.prototype.toJSON = function () {
    return Number(this);
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// config swagger
const swaggerSpecs = swaggerJsdoc(swaggerConfig);
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(dirname, '../uploads')));
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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tweets', tweetRouter);
app.use('/api/v1/trends', trendRouter);

app.use('/api/v1/interactions', interactionRouter);

app.use('/api/v1/home', homeRouter);

// handle all other routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// handle all errors
app.use(globalErrorHandlerMiddleware);

app.use(passport.initialize());

export default app;
