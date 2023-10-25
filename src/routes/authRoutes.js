import { Router } from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    sendEmailVerificationSchema,
    forgetPasswordSchema,
} from '../validations/authSchema.js';
import authController from '../controllers/authController.js';
import {
    deleteToken,
    getUser,
    createNewUser,
} from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import Upload from '../middlewares/avatar.js';
import { loginSchema } from '../validations/authSchema.js';
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

/**
 * @swagger
 * /auth/forgetPassword:
 *   post:
 *     summary: Send an email to a user with token and url to reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - UUID
 *             properties:
 *               UUID:
 *                 type: string
 *                 description: unique user identifer it could an email or username or phone.
 *                 format: email | username | phone
 *             example:
 *               UUID: "aliaa@aliaa.com"
 *     responses:
 *       200:
 *         description: Email with token sent successfully.
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
 *       404:
 *         description: Not found - no user exist with (username | email | phone).
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
 *                   enum: [User not found.]
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
 *                  message: 'email or phone or username is required field'
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

authRouter.route('/signup').post(Upload.single('avatar'), createNewUser);

authRouter.route('/login').post(validateMiddleware(loginSchema), getUser);

authRouter.route('/logout').post(auth, deleteToken);

authRouter.post(
    '/sendEmailVerification',
    validateMiddleware(sendEmailVerificationSchema),
    authController.SendEmailVerification
);

authRouter.post(
    '/forgetPassword',
    validateMiddleware(forgetPasswordSchema),
    authController.forgetPassword
);

export default authRouter;
