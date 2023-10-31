import { Router } from 'express';
import { isEmailUnique,isUsernameUnique } from '../controllers/userController.js';

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
 *           type: bytes
 *           format: x-image
 *         avatar:
 *           type: bytes
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
 * /users/checkEmailUniqueness:
 *   get:
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
 * /users/checkUsernameUniqueness:
 *   get:
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
 *                   enum: [email already exists]
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
 * /users/blocks?limit=value&offset=value:
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: bytes
 *                       bio:
 *                         type: string
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
 *                           "username": "EmanElbedwihy",
 *                           "name": "Eman",
 *                           "avatar": [21, 12, 12],
 *                           "bio": "CUFE"
 * 
 *                        },
 *                        {
 *                           "username": "AyaElbadry",
 *                           "name": "Aya",
 *                           "avatar": [21, 12, 12],
 *                           "bio": "pharmacy student HUE"
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
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
 * users/tweets/{id}?limit=value&offset=value:
 *   get:
 *     summary: get tweets of a certain user
 *     tags: [Users]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: Date
 *                       text:
 *                         type: string
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                       mentions:
 *                         type: array
 *                         items:
 *                           type:string
 *                       ternds:
 *                         type: array
 *                         items:
 *                           type:string
 *                       likes:
 *                         type: integer
 *                       reposts:
 *                         type: integer
 *                       replies:
 *                         type: integer
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
 *                           "createdAt": 22-10-2023,
 *                           "text": "this in text",
 *                           "media": ["pic1","pic2"],
 *                           "mentions": ["@bla", "@anything"],
 *                           "trends": ["@bla", "@anything"],
 *                           "likes": 10,
 *                           "reposts": 2,
 *                           "replies": 5
 * 
 *                        },
 *                        {
 *                           "createdAt": 29-10-2023,
 *                           "text": "this in blabla",
 *                           "media": ["pic3","pic4"],
 *                           "mentions": ["@anything"],
 *                           "trends": [],
 *                           "likes": 5,
 *                           "reposts": 1,
 *                           "replies": 3
 * 
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
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
 *      
 */

/**
 * @swagger
 * /users/blocks/{id}:
 *   delete:
 *     summary: user unblocks another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: blocked id
 *         in: path
 *         description: the id of the user(blocked)
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
 * /users/mutes/{id}:
 *   post:
 *     summary: user mutes another  user 
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: muted id
 *         in: path
 *         description: the id of the user(muted)
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
 *                  message: 'user already muted'  
 *      
 */

/**
 * @swagger
 * /users/mutes?limit=value&offset=value:
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: bytes
 *                       bio:
 *                         type: string
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
 *                           "username": "EmanElbedwihy",
 *                           "name": "Eman",
 *                           "avatar": [21, 12, 12],
 *                           "bio": "CUFE"
 * 
 *                        },
 *                        {
 *                           "username": "AyaElbadry",
 *                           "name": "Aya",
 *                           "avatar": [21, 12, 12],
 *                           "bio": "pharmacy student HUE"
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
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
 * /users/mutes/{id}:
 *   delete:
 *     summary: user unmutes another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: muted id
 *         in: path
 *         description: the id of the user(muted)
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
 *                  message: 'user is not muted'  
 *      
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
 *               - username
 *               - name
 *               - birthdayDate
 *               - bio
 *               - phone
 *               - website
 *               - avatar
 *               - cover
 *               - location      
 *             properties:
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
 *                 type: string
 *                 description: avatar of the user.
 *                 format: link
 *                 enum: [http://tweexy.com/images/pic1.png]
 *               cover:
 *                 type: string
 *                 description: avatar of the user.
 *                 format: link
 *                 enum: [http://tweexy.com/images/pic2.png]
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
 *                       type: string
 *                     phone:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                     username: "aliaagheis"
 *                     name: "aliaa gheis"
 *                     email: "aliaagheis@gmail.com"
 *                     avatar: "http://tweexy.com/images/pic1.png"
 *                     phone: "01118111210"
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
 * /users/follow/{id}:
 *   post:
 *     summary: user follows another user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: followed id
 *         in: path
 *         description: the id of the user(followed)
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
 *                  message: 'user already follwed'  
 *      
 */

/**
 * @swagger
 * /users/block/{id}:
 *   post:
 *     summary: user blocks another user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: blocked id
 *         in: path
 *         description: the id of the user(blocked)
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
 *      
 */

/**
 * @swagger
 * /users/follow/{id}:
 *   delete:
 *     summary: user unfollows another user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: followed id
 *         in: path
 *         description: the id of the user(fllowed)
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
 *                  message: 'user not blocked'  
 *      
 */

/**
 * @swagger
 * /users/{id}/followings?limit=value&offset=value:
 *   get:
 *     summary: get the users who the user follows
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       bio:
 *                         type: string
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
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "bio": "CUFE"
 *                        },
 *                        {
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE"
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
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
 */

/**
 * @swagger
 * /users/{id}/followers?limit=value&offset=value:
 *   get:
 *     summary: get the users who follow the user
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                         description: true for already following , false for follow back
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
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "bio": "CUFE",
 *                           "status":true
 *                        },
 *                        {
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE",
 *                           "status": false
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
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
 */

/**
 * @swagger
 * /users/search/{username|name}?limit=value&offset=value:
 *   get:
 *     summary: search for matching users using their username or name
 *     tags: [Users]
 *     parameters:
 *       - name: username|name
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       bio:
 *                         type: string
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
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "bio": "CUFE"
 *                        },
 *                        {
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "bio": "pharmacy student HUE"
 *                        }
 *                      ]
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
 *                               "nextPage": "users/blocks?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
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
// userRouter.route('/:id').get(getUserById);


const userRouter = Router();
userRouter.route('/checkEmailUniqueness').get(isEmailUnique);
userRouter.route('/checkUsernameUniqueness').get(isUsernameUnique);

export default userRouter;
