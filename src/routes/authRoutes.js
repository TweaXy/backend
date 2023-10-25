import { Router } from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { sendEmailVerificationSchema } from '../validations/authSchema.js';
import authController from '../controllers/authController.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Users authentication API
 */

/**
 * @swagger
 * /auth/sendEmailVerification:
 *   post:
 *     summary: Send an email verification to a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user (must be unique).
 *                 format: email
 *     responses:
 *       200:
 *         description: Email verification sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   description: null
 *               example:
 *                 status: success
 *                 data: null
 *       400:
 *         description: Bad Request - Email is already in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [fail]
 *                   description: The status of the response.
 *                 message:
 *                   type: string
 *                   enum: [Email is already exists and verified]
 *       403:
 *         description: Forbidden Request - validation fail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [fail]
 *                   description: The status of the response.
 *                 message:
 *                   type: string
 *               example:
 *                  status: fail
 *                  message: 'body.email is required field'
 *       429:
 *         description: More than one request in less than 30 seconds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [fail]
 *                 message:
 *                   type: string
 *                   description: the error message
 *                   enum: [More than one request in less than 30 seconds]
 *       500:
 *         description: Internal Server Error - Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [error]
 *                   description: The status of the response.
 *                 message:
 *                   type: string
 *                   description: A general error message.
 *               example:
 *                 status: 'error'
 *                 message: 'Internal Server Error'
 */

const authRouter = Router();

authRouter.post(
    '/sendEmailVerification',
    validateMiddleware(sendEmailVerificationSchema),
    authController.SendEmailVerification
);

export default authRouter;
