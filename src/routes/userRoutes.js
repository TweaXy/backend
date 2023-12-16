import { Router } from 'express';
import {
    isEmailUnique,
    isUsernameUnique,
    doesUUIDExits,
    getUserByID,
    follow,
    unfollow,
    followers,
    followings,
    deleteProfileBanner,
    deleteProfilePicture,
    updateProfile,
    updateUserName,
    searchForUsers,
    updatePassword,
    checkPasswordController,
    updateEmail,
    mute,
    unmute,
    muteList
    block,
    unblock,
    blockList,
} from '../controllers/userController/index.js';

import {
    profileTweets,
    profileLikes,
    profileMentions,
} from '../controllers/profileController.js';
import checkPassword from '../middlewares/checkPassword.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import auth from '../middlewares/auth.js';
import {
    doesUUIDExitsSchema,
    isEmailUniqueSchema,
    isUsernameUniqueSchema,
    userIDSchema,
    userProfileSchema,
    checkPasswordSchema,
    checkEmailVerificationToUpdateEmailSchema,
} from '../validations/userSchema.js';
import upload from '../middlewares/avatar.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - name
 *         - email
 *         - password
 *         - birthdayDate
 *         - joinedDate
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email of user must be a unique
 *           format: email
 *         username:
 *           type: string
 *           description: The username of user must be a unique
 *         name:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *           type: string
 *         cover:
 *           type: string
 *           format: x-image
 *         avatar:
 *           type: string
 *           format: x-image
 *         bio:
 *           type: string
 *         location:
 *           type: string
 *         website:
 *           type: string
 *           format: x-link
 *         Tokens:
 *           type: string
 *           description: the Tokens for each user to authenticate
 *         joinedAt:
 *           type: string
 *           formate: date
 *           format: x-date
 *         birthdayDat:
 *           type: string
 *           format: x-date
 *         ResetToken:
 *           type: string
 *           description: the code used to reset password
 *       example:
 *         id: 'clo4glaw00000vlcohum0n8z3'
 *         username: 'Warren_Breitenberg'
 *         name: 'treva'
 *         email: 'Mazie@gmail.com'
 *         phone: '07019778111'
 *         password: '00000000'
 *         location: 'North Reubenchester'
 *         website: 'https:capital-charger.net'
 *         joinedAt: '2023-10-24T15:05:54.528Z'
 *         birthdayDate: '1976-03-04'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: array
 *       items:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              description: The auto-generated id of the user
 *            email:
 *              type: string
 *              description: The email of user must be a unique
 *              format: email
 *            username:
 *              type: string
 *              description: The username of user must be a unique
 *            name:
 *              type: string
 *            avatar:
 *              type: string
 *              format: url
 *            bio:
 *              type: string
 *            followsMe:
 *              type: boolean
 *            followedByMe:
 *              type:boolean
 *       example:
 *         userId: 'clo4glaw00000vlcohum0n8z3'
 *         email: 'Mazie@gmail.com'
 *         username: 'Warren_Breitenberg'
 *         name: 'treva'
 *         avatar: '"http://tweexy.com/images/pic4.png"'
 *         bio: 'wow I am so cool'
 *         followsMe: false,
 *         followedByMe: true
 *
 */

/**
 * @swagger
 * /users/checkEmailUniqueness:
 *   post:
 *     summary: check email uniqueness
 *     tags: [Users]
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
 *                 description: The email of the user .
 *                 format: email
 *                 example: "aliaagheis@gmail.com"
 *     responses:
 *       200:
 *         description: Email has not been used before(unique).
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
 *       409:
 *         description: Conflict - Email has been used before.
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
 *                   enum: [email already exists]
 *               example:
 *                 status: 'fail'
 *                 message: 'Email has been used before'
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
 *
 */

/**
 * @swagger
 * /users/checkUUIDExists:
 *   post:
 *     summary: check UUID exist.
 *     tags: [Users]
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
 *                 description: The email or username or phone of the user .
 *                 format: email | username | phone
 *                 example: "aliaagheis@gmail.com"
 *     responses:
 *       200:
 *         description: there's exist user with this UUID.
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
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 * /users/checkUsernameUniqueness:
 *   post:
 *     summary: check username uniqueness
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user .
 *                 example: "emanelbedwihy"
 *     responses:
 *       200:
 *         description: Username has not been used before(unique).
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
 *       409:
 *         description: Conflict - Username has been used before.
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
 *                   enum: [username already exists]
 *               example:
 *                 status: 'fail'
 *                 message: 'Username has been used before.'
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
 *
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: get the user by his/her ID.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the user
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  user returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 user:
 *                      $ref: '#/components/schemas/User'
 *               example:
 *                 status: success
 *                 data:
 *                     id: "123"
 *                     username: "aliaagheis"
 *                     name: "aliaa gheis"
 *                     email: "aliaagheis@gmail.com"
 *                     avatar: "http://tweexy.com/images/pic1.png"
 *                     cover: "http://tweexy.com/images/pic2.png"
 *                     phone: "01118111210"
 *                     website: "bla@goole.com"
 *                     bio: "i am"
 *                     location: "cairo"
 *                     joinedAt: 29-10-2023
 *                     birthdayDate: 29-10-2023
 *                     _count:
 *                       followedBy: 3
 *                       following: 5
 *                     followedByMe: true
 *                     followsMe: false
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 * /users:
 *   patch:
 *     summary: update the user informations.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - birthdayDate
 *               - bio
 *               - phone
 *               - website
 *               - avatar
 *               - cover
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 description: screen name of user.
 *                 enum: [tweexy cool]
 *               birthdayDate:
 *                 type: date
 *                 description: birthdate of  user.
 *                 format: Date
 *                 enum: [10-17-2002]
 *               bio:
 *                 type: string
 *                 description: bio of the user.
 *                 enum: [Media & News Company]
 *               phone:
 *                 type: string
 *                 description: phone of the user.
 *                 format: phone
 *                 enum: ["01285075379"]
 *               website:
 *                 type: string
 *                 description: website of the user.
 *                 format: link
 *                 enum: [http://gmail.com]
 *               avatar:
 *                 type: bytes
 *                 description: avatar of the user.
 *                 format: link
 *                 enum: [binary]
 *               cover:
 *                 type: bytes
 *                 description: avatar of the user.
 *                 format: link
 *                 enum: [binary]
 *               location:
 *                 type: string
 *                 description: location of the user.
 *                 enum: [Giza]
 *     responses:
 *       200:
 *         description: user updated successfully
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
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *                  message: 'uri is not valid'
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       400:
 *         description: no body.
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
 *                   enum: [no body.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no body.'
 *
 */

/**
 * @swagger
 * /users/profilePicture:
 *   delete:
 *     summary: delete profile picture.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  profile photo deleted successfully.
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
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       409:
 *         description: conflict.
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
 *                  message: 'profile picture does not exist'
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 */

/**
 * @swagger
 * /users/profileBanner:
 *   delete:
 *     summary: delete cover picture.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  cover photo deleted successfully.
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
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       409:
 *         description: conflict.
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
 *                  message: 'cover picture does not exist'
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 */

/**
 * @swagger
 * /users/follow/{username}:
 *   post:
 *     summary: user follows another user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: followed username
 *         in: path
 *         description: the username of the user(followed)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: user is followed successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       404:
 *         description: Not found - no user with this username exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user is already follwed'
 *       403:
 *         description: Forbidden Request.
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
 *             examples:
 *               example1:
 *                 value:
 *                   status: fail
 *                   message: 'users can not follow themselves'
 *               example2:
 *                 value:
 *                   status: fail
 *                   message: 'user can not follow a blocking user'
 *               example3:
 *                 value:
 *                   status: fail
 *                   message: 'user can not follow a blocked user'
 *
 */

/**
 * @swagger
 * /users/follow/{username}:
 *   delete:
 *     summary: user unfollows another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: followed username
 *         in: path
 *         description: the username of the user(followed)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: user is unfollowed successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user is already unfollowed'
 *
 */

/**
 * @swagger
 * /users/followings/{username}?limit=value&offset=value:
 *   get:
 *     summary: get the user followings
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         description: the username of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  list of followings is returned successfully.
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
 *                     followings:
 *                           $ref: '#/components/schemas/Users'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string
 *                     prevPage:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                      {
 *                        followings:
 *                        [
 *                        {  "id":"123r3rf",
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "bio": "CUFE",
 *                           "followsMe": false,
 *                           "followedByMe": true
 *                        },
 *                        {
 *                           "id":"123r3rdf",
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE",
 *                           "followsMe": false,
 *                           "followedByMe": true
 *                        }
 *                        ]
 *                      }
 *                 pagination:
 *                            {  "totalCount": 20,
 *                               "itemsCount": 10,
 *                               "nextPage": "users/followings?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
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
 *                  message: 'user can not see followings of a blocking user'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 * /users/followers/{username}?limit=value&offset=value:
 *   get:
 *     summary: get the user followers
 *     tags: [Users]
 *     parameters:
 *       - name: username
 *         in: path
 *         description: the username of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  list of followers is returned successfully.
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
 *                     followers:
 *                           $ref: '#/components/schemas/Users'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string
 *                     prevPage:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                      [
 *                        {  "id": "123",
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "bio": "CUFE",
 *                           "status":true
 *                        },
 *                        {
 *                           "id":"125",
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE",
 *                           "status": false
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "totalCount": 20,
 *                               "itemsCount": 10,
 *                               "nextPage": "users/followers?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
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
 *                  message: 'user can not see followers of a blocking user'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 * /users/block/{username}:
 *   post:
 *     summary: user blocks another user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: blocked username
 *         in: path
 *         description: the username of the user(blocked)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: user is blocked successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user already blocked'
 *       403:
 *         description: Forbidden Request .
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
 *                  message: 'users can not block themselves'
 *
 */

/**
 * @swagger
 * /users/block/list?limit=value&offset=value:
 *   get:
 *     summary: get list of blocks
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  list of blocks is returned successfully
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
 *                     blocks:
 *                           $ref: '#/components/schemas/Users'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string
 *                     prevPage:
 *                       type: string
 *               example:
 *                 status: success
 *                 data: {
 *                        blocks:
 *                        [
 *                        {  "id":"123",
 *                           "username": "EmanElbedwihy",
 *                           "name": "Eman",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "CUFE"
 *
 *                        },
 *                        {
 *                           "id": 124",
 *                           "username": "AyaElbadry",
 *                           "name": "Aya",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE"
 *                        }
 *                      ]
 *                      }
 *                 pagination:
 *                            {
 *                               "totalCount": 30,
 *                               "itemsCount": 10,
 *                               "nextPage": "users/blocks?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *
 */

/**
 * @swagger
 * /users/block/{username}:
 *   delete:
 *     summary: user unblocks another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: blocked username
 *         in: path
 *         description: the username of the user(blocked)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: block is deleted successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user is already unblocked'
 *
 */

/**
 * @swagger
 * /users/tweets/{id}?limit=value&offset=value:
 *   get:
 *     summary: get tweets of a certain user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: user id
 *         in: path
 *         description: the id of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  tweets is returned successfully
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           mainInteraction:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               text:
 *                                 type: string
 *                               createdDate:
 *                                 type: string
 *                                 format: date-time
 *                               type:
 *                                 type: string
 *                                 enum: [TWEET, RETWEET]
 *                               media:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   username:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   avatar:
 *                                     type: string|null
 *                               likesCount:
 *                                   type: integer
 *                               viewsCount:
 *                                   type: integer
 *                               retweetsCount:
 *                                   type: integer
 *                               commentsCount:
 *                                   type: integer
 *                               isUserInteract:
 *                                 type: object
 *                                 properties:
 *                                   isUserLiked:
 *                                     type: number
 *                                     enum: [0, 1]
 *                                   isUserRetweeted:
 *                                     type: number
 *                                     enum: [0, 1]
 *                                   isUserCommented:
 *                                     type: number
 *                                     enum: [0, 1]
 *                           parentInteraction:
 *                             type: object|null
 *                             properties:
 *                               id:
 *                                 type: string
 *                               text:
 *                                 type: string
 *                               createdDate:
 *                                 type: string
 *                                 format: date-time
 *                               type:
 *                                 type: string
 *                                 enum: [TWEET, RETWEET, COMMENT]
 *                               media:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   username:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   avatar:
 *                                     type: string|null
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string|null
 *                     prevPage:
 *                       type: string|null
 *               example:
 *                 status: "success"
 *                 data:
 *                   items:
 *                     - mainInteraction:
 *                         id: "ay6j6hvladtovrv7pvccj494d"
 *                         text: "Aut totam caries valetudo dolorum ipsa tabula desparatus ceno trepide."
 *                         createdDate: "2023-11-24T12:19:51.437Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
 *                       parentInteraction:
 *                         id: "ay6j6hvladtovrv7pvccj494d"
 *                         text: "Aut totam caries valetudo dolorum ipsa tabula desparatus ceno trepide."
 *                         createdDate: "2023-11-24T12:19:51.437Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                     - mainInteraction:
 *                         id: "hnnkpljfblz17i4mnahajwvuo"
 *                         text: "Quasi accedo comptus cui cura adnuo alius."
 *                         createdDate: "2023-11-24T12:19:51.432Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 1
 *                           isUserCommented: 1
 *                       parentInteraction: null
 *                     - mainInteraction:
 *                         id: "u8te7yj4b3pdkyeg2vuq053v3"
 *                         text: "Adsuesco agnosco tamen ubi summopere adsum debeo vaco dolorum."
 *                         createdDate: "2023-11-24T12:19:51.435Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 0
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
 *                       parentInteraction: null
 *                 pagination:
 *                   totalCount: 9
 *                   itemsCount: 3
 *                   nextPage: null
 *                   prevPage: "http://localhost:3000/api/v1/home/?limit=3&offset=3"
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       403:
 *         description: Forbidden Request.
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
 *                  message: 'user can not see tweets of a blocking user'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *
 */

/**
 * @swagger
 * /users/tweets/liked/{id}?limit=value&offset=value:
 *   get:
 *     summary: get  liked tweets of a certain user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: user id
 *         in: path
 *         description: the id of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  liked tweets is returned successfully
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           mainInteraction:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               text:
 *                                 type: string
 *                               createdDate:
 *                                 type: string
 *                                 format: date-time
 *                               type:
 *                                 type: string
 *                                 enum: [TWEET, RETWEET]
 *                               media:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   username:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   avatar:
 *                                     type: string|null
 *                               likesCount:
 *                                   type: integer
 *                               viewsCount:
 *                                   type: integer
 *                               retweetsCount:
 *                                   type: integer
 *                               commentsCount:
 *                                   type: integer
 *                               isUserInteract:
 *                                 type: object
 *                                 properties:
 *                                   isUserLiked:
 *                                     type: number
 *                                     enum: [0, 1]
 *                                   isUserRetweeted:
 *                                     type: number
 *                                     enum: [0, 1]
 *                                   isUserCommented:
 *                                     type: number
 *                                     enum: [0, 1]
 *                           parentInteraction:
 *                             type: object|null
 *                             properties:
 *                               id:
 *                                 type: string
 *                               text:
 *                                 type: string
 *                               createdDate:
 *                                 type: string
 *                                 format: date-time
 *                               type:
 *                                 type: string
 *                                 enum: [TWEET, RETWEET, COMMENT]
 *                               media:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   username:
 *                                     type: string
 *                                   name:
 *                                     type: string
 *                                   avatar:
 *                                     type: string|null
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string|null
 *                     prevPage:
 *                       type: string|null
 *               example:
 *                 status: "success"
 *                 data:
 *                   items:
 *                     - mainInteraction:
 *                         id: "ay6j6hvladtovrv7pvccj494d"
 *                         text: "Aut totam caries valetudo dolorum ipsa tabula desparatus ceno trepide."
 *                         createdDate: "2023-11-24T12:19:51.437Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
 *                       parentInteraction:
 *                         id: "ay6j6hvladtovrv7pvccj494d"
 *                         text: "Aut totam caries valetudo dolorum ipsa tabula desparatus ceno trepide."
 *                         createdDate: "2023-11-24T12:19:51.437Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                     - mainInteraction:
 *                         id: "hnnkpljfblz17i4mnahajwvuo"
 *                         text: "Quasi accedo comptus cui cura adnuo alius."
 *                         createdDate: "2023-11-24T12:19:51.432Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 1
 *                           isUserCommented: 1
 *                       parentInteraction: null
 *                     - mainInteraction:
 *                         id: "u8te7yj4b3pdkyeg2vuq053v3"
 *                         text: "Adsuesco agnosco tamen ubi summopere adsum debeo vaco dolorum."
 *                         createdDate: "2023-11-24T12:19:51.435Z"
 *                         type: "TWEET"
 *                         media: null
 *                         user:
 *                           id: "z0avg38jqi3hpr2ddvuql4v0l"
 *                           username: "Bethany_O'Connell"
 *                           name: "Arturo"
 *                           avatar: null
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 0
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
 *                       parentInteraction: null
 *                 pagination:
 *                   totalCount: 9
 *                   itemsCount: 3
 *                   nextPage: null
 *                   prevPage: "http://localhost:3000/api/v1/home/?limit=3&offset=3"
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       403:
 *         description: Forbidden Request.
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
 *                  message: 'user can not see likes of a blocking user'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *
 */

/**
 * @swagger
 * /users/tweets/mentioned/{id}?limit=value&offset=value:
 *   get:
 *     summary: get tweets where certain user mentioned in
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successfully retrived all mentioned in tweets of a certain user
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
 *                     mentions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                       tweetId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       text:
 *                         type: string
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                       likesCount:
 *                           type:integer
 *                       commentsCount:
 *                           type:integer
 *                       retweetsCount:
 *                           type:integer
 *                       createdAt:
 *                         type: DateTime
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     itemsNumber:
 *                       type: integer
 *                     nextPage:
 *                       type: string
 *                     prevPage:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                      [
 *                        {
 *                          "tweetId": "60f6e9a0f0f8a81e0c0f0f8a",
 *                           "username": "EmanElbedwihy",
 *                           "name": "hany",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "text": "wow aliaa so cool",
 *                           "media": [ "http://tweexy.com/images/pic1.png",  "http://tweexy.com/images/pic2.png"],
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "likesCount": 2000,
 *                           "commentsCount" :150,
 *                           "retweetsCount" :100
 *                        },
 *                        {
 *                          "tweetId": "60f6e9a0f0f8a81e0c0f0f8b",
 *                           "username": "AliaaGheis",
 *                           "name": "aliaa",
 *                           "avatar": "http://tweexy.com/images/pic2.png",
 *                           "text": "I am so cool",
 *                           "media": null,
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "likesCount": 100,
 *                           "commentsCount" :150,
 *                           "retweetsCount" :100
 *                        }
 *                      ]
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /tweets/search?query="*cool*"&limit=20&offset=20
 *                   prevPage: null
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
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
 *
 */

/**
 * @swagger
 * /users/block/{username}:
 *   delete:
 *     summary: user unblocks another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: blocked username
 *         in: path
 *         description: the username of the user(blocked)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: block is deleted successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user is not blocked'
 *
 */

/**
 * @swagger
 * /users/mute/{username}:
 *   post:
 *     summary: user mutes another  user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: muted username
 *         in: path
 *         description: the username of the user(muted)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: user is muted successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       403:
 *         description: Forbidden Request .
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
 *               examples:
 *                 example1:
 *                  status: fail
 *                  message: 'user is not followed'
 *                 example2:
 *                  status: fail
 *                  message: 'users can not mute themselves'
 * 
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user is already muted'
 *
 */

/**
 * @swagger
 * /users/mute/list?limit=value&offset=value:
 *   get:
 *     summary: get list of mutes
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  list of mutes is returned successfully
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
 *                     mutes:
 *                           $ref: '#/components/schemas/Users'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string
 *                     prevPage:
 *                       type: string
 *               example:
 *                 status: success
 *                 data: {
 *                      mutes:
 *                      [
 *                        {  "id": "123",
 *                           "username": "EmanElbedwihy",
 *                           "name": "Eman",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "CUFE"
 *
 *                        },
 *                        {
 *                           "id":"124",
 *                           "username": "AyaElbadry",
 *                           "name": "Aya",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE"
 *                        }
 *                      ]
 *                      }
 *                 pagination:
 *                            {
 *                               "totalCount": 20,
 *                               "itemsCount": 10,
 *                               "nextPage": "users/mute?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *
 */

/**
 * @swagger
 * /users/mute/{username}:
 *   delete:
 *     summary: user unmutes another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: muted username
 *         in: path
 *         description: the username of the user(muted)
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: mute is deleted successfully
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
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       403:
 *         description: Forbidden Request .
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
 *                  message: 'user is not followed'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
 *       409:
 *         description: conflict.
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
 *                  message: 'user is already unmuted'
 *
 */

/**
 * @swagger
 * /users/search/{keyword}?limit=value&offset=value:
 *   get:
 *     summary: search for matching users using their username or name
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: keyword
 *         in: path
 *         description: the username or name of the user to be searched for
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: number of items in each page
 *         required: true
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: number of skipped items
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description:  list of users is returned successfully.
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
 *                     users:
 *                           $ref: '#/components/schemas/Users'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     itemsCount:
 *                       type: integer
 *                     nextPage:
 *                       type: string
 *                     prevPage:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                      {
 *                        users:
 *                        [
 *                        {  "id":"123r3rf",
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "bio": "CUFE",
 *                           "followsMe": false,
 *                           "followedByMe": true
 *                        },
 *                        {
 *                           "id":"123r3rdf",
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE",
 *                           "followsMe": false,
 *                           "followedByMe": true
 *                        }
 *                        ]
 *                      }
 *                 pagination:
 *                            {
 *                               "totalCount": 20,
 *                               "itemsCount": 10,
 *                               "nextPage": "users/search/E?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       400:
 *         description: Bad Request - Invalid parameters provided.
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
 *                   description: A message describing the error.
 *               example:
 *                 status: 'fail'
 *                 message: 'Invalid parameters provided'
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
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
 * /users/updateUserName:
 *   patch:
 *     summary: update username
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user .
 *                 example: "emanelbedwihy"
 *     responses:
 *       200:
 *         description: username has been updated successfully.
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
 *       409:
 *         description: Conflict - username already exists.
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
 *                   enum: [username already exists]
 *               example:
 *                 status: 'fail'
 *                 message: 'username already exists.'
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
 *       401:
 *         description: not authorized.
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
 *                   enum: [user not authorized.]
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
 *                  message: 'username must be at least 4 characters'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
 */

/**
 * @swagger
 * /users/password:
 *   patch:
 *     summary: update password
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The old Password of the user .
 *                 example: "123456789tT@"
 *               newPassword:
 *                 type: string
 *                 description: The new Password of the user .
 *                 example: "5858585885858huK@"
 *               confirmPassword:
 *                 type: string
 *                 description: The confirm Password of the user .
 *                 example: "5858585885858huK@"
 *     responses:
 *       200:
 *         description: Password has been updated successfully.
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
 *       401:
 *         description: not authorized.  no token provided  or wrong old password
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
 *                   enum: [user not authorized.]
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
 *                  message: 'password is required'
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
 *       400:
 *         description: bad requist   new password must be different from old password  or new password does not match with confirm password
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
 *                   enum: [new password does not match with confirm password]
 *               example:
 *                 status: 'fail'
 *                 message: 'new password does not match with confirm password'
 */

/**
 * @swagger
 * /users/email:
 *   patch:
 *     summary: update email
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *               - email
 *             properties:
 *               token:
 *                 type: string
 *                 description: email verification token .
 *                 example: "3341eecd@"
 *               email:
 *                 type: string
 *                 description: the new email of the user.
 *                 example: "nesmashafie342@gmail.com"
 *     responses:
 *       200:
 *         description: email has been updated successfully.
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
 *       401:
 *         description: not authorized. no token provided or Email Verification Code is expired or Email Verification Code is invalid
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
 *                   enum: [user not authorized.]
 *       404:
 *         description: Not found - no user with this id exists or no email request verification found
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
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
 *                  message: 'email is required field'
 */

/**
 * @swagger
 * /users/checkPassword:
 *   post:
 *     summary: check if the password is correct
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *                 description: The password of the user .
 *                 format: password
 *                 example: "123456789tT@"
 *     responses:
 *       200:
 *         description: correct password.
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
 *                  message: 'password is required field'
 *       401:
 *         description: not authorized. no token provided or wrong password
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
 *                   enum: [user not authorized.]
 *       404:
 *         description: Not found - no user with this id exists.
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
 *                   enum: [no user found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no user found.'
 */

const userRouter = Router();

import { pagination } from '../utils/index.js';
import notificationController from '../controllers/notificationController.js';

userRouter.route('/').get(async (req, res, next) => {
    const results = await pagination(req, 'user', {
        select: {
            id: true,
            username: true,
            email: true,
        },
    });
    return res.json(results);
});

userRouter
    .route('/checkEmailUniqueness')
    .post(validateMiddleware(isEmailUniqueSchema), isEmailUnique);
userRouter
    .route('/checkUsernameUniqueness')
    .post(validateMiddleware(isUsernameUniqueSchema), isUsernameUnique);
userRouter
    .route('/checkUUIDExists')
    .post(validateMiddleware(doesUUIDExitsSchema), doesUUIDExits);

userRouter
    .route('/follow/:username')
    .post(auth, follow, notificationController.addFollowNotification);
userRouter.route('/follow/:username').delete(auth, unfollow);

userRouter.route('/followers/:username').get(auth, followers);
userRouter.route('/followings/:username').get(auth, followings);

userRouter
    .route('/:id')
    .get(auth, validateMiddleware(userIDSchema), getUserByID);

userRouter.route('/profileBanner').delete(auth, deleteProfileBanner);

userRouter.route('/profilePicture').delete(auth, deleteProfilePicture);

userRouter.route('/').patch(
    auth,
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,
        },
        {
            name: 'cover',
            maxCount: 1,
        },
    ]),
    validateMiddleware(userProfileSchema),
    updateProfile
);

userRouter
    .route('/updateUserName')
    .patch(auth, validateMiddleware(isUsernameUniqueSchema), updateUserName);

userRouter.route('/search/:keyword').get(auth, searchForUsers);

userRouter
    .route('/password')
    .patch(
        auth,
        checkPassword,
        validateMiddleware(checkPasswordSchema),
        updatePassword
    );

userRouter
    .route('/checkPassword')
    .post(auth, checkPassword, checkPasswordController);

userRouter
    .route('/email')
    .patch(
        auth,
        validateMiddleware(checkEmailVerificationToUpdateEmailSchema),
        updateEmail
    );

userRouter
    .route('/tweets/:id')
    .get(auth, validateMiddleware(userIDSchema), profileTweets);

userRouter
    .route('/tweets/liked/:id')
    .get(auth, validateMiddleware(userIDSchema), profileLikes);

userRouter
    .route('/tweets/mentioned/:id')
    .get(auth, validateMiddleware(userIDSchema), profileMentions);

userRouter.route('/block/:username').post(auth, block);
userRouter.route('/block/:username').delete(auth, unblock);
userRouter.route('/block/list').get(auth, blockList);

userRouter.route('/mute/:username').post(auth, mute);

userRouter.route('/mute/:username').delete(auth, unmute);
userRouter.route('/mute/list').get(auth, muteList);

export default userRouter;
