import { Router } from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    sendEmailVerificationSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    signupSchema,
    loginSchema,
} from '../validations/authSchema.js';
import authController from '../controllers/authController.js';
import {
    deleteToken,
    getUser,
    createNewUser,
    checkEmailVerification,
} from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import Upload from '../middlewares/avatar.js';
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Users authentication API
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: create & authincate new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - name
 *               - birthdayDate
 *               - password
 *               - emailVerificationToken
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user (must be unique).
 *                 format: email
 *                 example: "aliaagheis@gmail.com"
 *               username:
 *                 type: string
 *                 description: unique username of user.
 *                 enum: [tweexy123]
 *               name:
 *                 type: string
 *                 description: screen name of user.
 *                 enum: [tweexy cool]
 *               birthdayDate:
 *                 type: string
 *                 description: unique username of user.
 *                 format: Date
 *                 enum: [10-17-2002]
 *               password:
 *                 type: string
 *                 description: password of user.
 *                 format: password
 *                 enum: [12345678tT@]
 *               emailVerificationToken:
 *                 type: string
 *                 description: token send to email to verify it.
 *                 enum: [123f08]
 *     responses:
 *       200:
 *         description: >
 *           User created successfully.
 *           the token is returned in a cookie named `token`.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=abcde12345; Path=/; HttpOnly
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
 *                   properties:
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: bytes
 *                     phone:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                     username: "aliaagheis"
 *                     name: "aliaa gheis"
 *                     email: "aliaagheis@gmail.com"
 *                     avatar: [21, 12, 12]
 *                     phone: "01118111210"
 *       400:
 *         description: Bad Request - Email or username is already in the database.
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
 *                   example: [there is a user in database with same email or username]
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
 *       404:
 *         description: Not found - no email verification exist.
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
 *                   enum: [no email request verification found.]
 *       401:
 *         description: verification token is invalid or expired
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
 *                   enum: ["Token is invalid" , "Token is expired"]
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

/**
 * @swagger
 * /auth/resetPassword/{UUID}/{token}:
 *   post:
 *     summary: reset user password to new password if the token is valid
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: UUID
 *         schema:
 *           type: string
 *         required: true
 *         description: unique user identifer it could an email or username or phone.
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: token sent to user email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: new password to reset it.
 *                 format: password
 *             example:
 *               password: "12345678aA@"
 *     responses:
 *       200:
 *         description: >
 *           Password Reset successfully.
 *           the token is returned in a cookie named `token`.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=abcde12345; Path=/; HttpOnly
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
 *                  message: 'password must contain at least 1 number'
 *       401:
 *         description: token is invalid or expired or when user don't have reset token
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
 *                   enum: ["Token is invalid" , "Token is expired" , "User does not have reset token"]
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

authRouter
    .route('/signup')
    .post(
        Upload.single('avatar'),
        validateMiddleware(signupSchema),
        checkEmailVerification,
        createNewUser
    );

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

authRouter.post(
    '/resetPassword/:UUID/:token',
    validateMiddleware(resetPasswordSchema),
    authController.resetPassword
);

export default authRouter;
