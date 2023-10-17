import express from 'express';
import userRouter from './routes/userRoutes.js';

import swaggerConfig from './config/swaggerConfig.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// config swagger
const swaggerSpecs = swaggerJsdoc(swaggerConfig);

const app = express();

app.use(express.json());

app.use(
    '/api/v1/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, { explorer: true })
);
app.use('/api/v1/users', userRouter);

export default app;
