import { Router } from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    sendEmailVerificationSchema,
    checkEmailVerificationSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    signupSchema,
    loginSchema,
} from '../validations/authSchema.js';

import {
    signinWithGoogle,
    signinWithGoogleAndroid,
} from '../controllers/authController/googleAuthController.js';

import authController from '../controllers/authController/index.js';
import auth from '../middlewares/auth.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Users authentication API
 */
/**
 * @swagger
 * /auth/checkEmailVerification/{email}/{token}:
 *   get:
 *     summary: check email verification token if it is valid or not
 *     tags: [Auth]
 *     parameters:
 *           - in: path
 *             name: email
 *             schema:
 *               type: string
 *             required: true
 *             description: email of user.
 *           - in: path
 *             name: token
 *             schema:
 *               type: string
 *             required: true
 *             description: token sent to user email.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: >
 *           user email and token found.
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
 *                   enum: [null]
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
 *                   enum: ["Email Verification Code is expired" , "Email Verification Code is invalid"]
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
 * /auth/checkResetToken/{email}/{token}:
 *   get:
 *     summary: check reset token if it's valid or not
 *     tags: [Auth]
 *     parameters:
 *           - in: path
 *             name: email
 *             schema:
 *               type: string
 *             required: true
 *             description: email of user.
 *           - in: path
 *             name: token
 *             schema:
 *               type: string
 *             required: true
 *             description: token sent to user email.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: >
 *           user and token found.
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
 *                   enum: [null]
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
 *                   enum: [user not found.]
 *       401:
 *         description: Reset Code is invalid or expired
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
 *                   enum: ["Reset Code is expired" , "Reset Code is invalid"]
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
 *               - name
 *               - birthdayDate
 *               - password
 *               - emailVerificationToken
 *               - email
 *               - captcha
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user (must be unique).
 *                 format: email
 *                 example: "aliaagheis@gmail.com"
 *                 captcha:"captcha value"
 *               name:
 *                 type: string
 *                 description: screen name of user.
 *                 enum: [tweexy cool]
 *               birthdayDate:
 *                 type: string
 *                 description: birthdate of user.
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                         _count:
 *                           type: object
 *                           properties:
 *                             blocking:
 *                               type:integer
 *                             muting:
 *                               type:integer
 *                     token:
 *                         type: string
 *               example:
 *                 status: success
 *                 data:
 *                   user:
 *                     id: "dfghjkl"
 *                     username: "aliaagheis"
 *                     name: "aliaa gheis"
 *                     email: "aliaagheis@gmail.com"
 *                     avatar: "http://tweexy.com/images/defualt.png"
 *                     _count:
 *                       blocking: 3
 *                       muting: 5
 *                   token:
 *                        "c178edaa60a13d7d6dade6a7361c4971713ae1c6dbfe3025acfba80c2932b21c"
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
 *                   enum: ["Email Verification Code is invalid" , "Email Verification Code is expired"]
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
 *                 data: {userId: "dfghjkl"}
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
 *                   properties:
 *                       token:
 *                         type: string
 *               example:
 *                 status: success
 *                 data:
 *                   token:
 *                        "c178edaa60a13d7d6dade6a7361c4971713ae1c6dbfe3025acfba80c2932b21c"
 *                   userId: "dfghjkl"
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
 *                   enum: ["Reset Code is invalid" , "Reset Code is expired" , "User does not have reset token"]
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
 * /auth/login:
 *   post:
 *     summary: login the user(return user basic information and create a token for the user).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               -UUID
 *               - password
 *             properties:
 *               UUID:
 *                 type: string
 *                 description:   unique user identifer it could an email or username or phone.
 *                 format: email | username | phone
 *               password:
 *                 type: string
 *                 description:  password of the user.
 *                 format: password
 *             example:
 *                   UUID: "fdsd@gmail.com"
 *                   password: "12345678aA@"
 *     responses:
 *       200:
 *         description: >
 *          user logged in successfully.
 *          the token is returned in a cookie named `token`.
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                         _count:
 *                           type: object
 *                           properties:
 *                             blocking:
 *                               type:integer
 *                             muting:
 *                               type:integer
 *                     token:
 *                         type: string
 *               example:
 *                 status: success
 *                 data:
 *                   user:
 *                     username: "aliaagheis"
 *                     name: "aliaa gheis"
 *                     email: "aliaagheis@gmail.com"
 *                     avatar: "http://tweexy.com/images/pic1.png"
 *                     _count:
 *                       blocking: 3
 *                       muting: 5
 *                   token:
 *                        "c178edaa60a13d7d6dade6a7361c4971713ae1c6dbfe3025acfba80c2932b21c"
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
 *                  message: 'UUID is required field'
 *       404:
 *         description: Not found - no user found.
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
 *                  message: 'no user found'
 *       401:
 *         description: password is invalid
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
 *               example:
 *                  status: fail
 *                  message: 'wrong password'
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
 * /auth/logout:
 *   post:
 *     summary: logout the user(add token to blacklist).
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: [] 
 *     requestBody:  
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               -token
 *               - type
 *             properties:
 *               token:
 *                 type: string
 *                 description:  token of the device.
 *               type:
 *                 type: string
 *                 description: type of device andorid or web.
 *             example:
 *                   token: "nipcgt82fx19bo92wflzsifhpm"
 *                   type: "android"
 *     responses:
 *       200:
 *         description: >
 *          user logout successfully successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *               example:
 *                 status: success
 *       401:
 *         description: user not authorized.
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
 *                  message: 'please authenticate'

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
 * /auth/google:
 *   post:
 *     summary: Google authentication .
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: >
 *          user logged in successfully.
 *          the token is returned in a cookie named `token`.
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                         _count:
 *                           type: object
 *                           properties:
 *                             blocking:
 *                               type:integer
 *                             muting:
 *                               type:integer
 *                     token:
 *                         type: string
 *               example:
 *                 status: success
 *                 data:
 *                   user:
 *                     username: "aliaagheis"
 *                     name: "aliaa gheis"
 *                     email: "aliaagheis@gmail.com"
 *                     avatar: "http://tweexy.com/images/pic1.png"
 *                     _count:
 *                       blocking: 3
 *                       muting: 5
 *                   token:
 *                        "c178edaa60a13d7d6dade6a7361c4971713ae1c6dbfe3025acfba80c2932b21c"
 *       404:
 *         description: Not found - no user found.
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
 *                  message: 'no user found'
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
        validateMiddleware(signupSchema),
        authController.captcha,
        authController.signup
    );

authRouter
    .route('/login')
    .post(validateMiddleware(loginSchema), authController.login);

authRouter.route('/logout').post(auth, authController.logout);

authRouter.post(
    '/sendEmailVerification',
    validateMiddleware(sendEmailVerificationSchema),
    authController.sendEmailVerification
);

// authRouter.post('/captcha', authController.captcha);

authRouter.get(
    '/checkEmailVerification/:email/:token',
    validateMiddleware(checkEmailVerificationSchema),
    authController.checkEmailVerification
);

authRouter.get(
    '/checkResetToken/:email/:token',
    validateMiddleware(checkEmailVerificationSchema),
    authController.checkResetToken
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

authRouter.post('/google', signinWithGoogle);
authRouter.post('/google/android', signinWithGoogleAndroid);

export default authRouter;
