import { Router } from 'express';
import auth from '../middlewares/auth.js';
import interactionController from '../controllers/interactionController.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    interactionIDSchema,
    interactionSchema,
} from '../validations/interactionSchema.js';
import upload from '../middlewares/addMedia.js';
import notificationController from '../controllers/notificationController.js';

/**
 * @swagger
 * tags:
 *   name: Interactions
 *   description: The Tweets managing API
 */

/**
 * @swagger
 * /interactions/{id}/likers?limit=value&offset=value:
 *   get:
 *     summary: get the users who likes interaction
 *     tags: [Interactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the interaction
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
 *         description:  list of likers is returned successfully.
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
 *                     likers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       followsMe:
 *                         type:Boolean
 *                       followedByMe:
 *                         type:Boolean
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
 *                         "likers": [
 *                          {
 *                              "id": "123",
 *                              "name": "Eman",
 *                               "username": "EmanElbedwihy",
 *                              "avatar": "http://tweexy.com/images/pic1.png",
 *                               "bio": "CUFE",
 *                              "followsMe": true,
 *                              "followedByMe": true
 *                               },
 *                              {
 *                               "id": "125",
 *                              "name": "Aya",
 *                               "username": "AyaElbadry",
 *                              "avatar": "http://tweexy.com/images/pic4.png",
 *                               "bio": "pharmacy student HUE",
 *                              "followsMe": true,
 *                              "followedByMe": false
 *                           }
 *                      ]
 *                     }
 *                 pagination:
 *                            {
 *                               "totalCount": 20,
 *                               "itemsCount": 10,
 *                               "nextPage": "users/blocks?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       404:
 *         description: Not found - no interaction with this id exists.
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
 *                   enum: [no interaction found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no interaction found.'
 *       403:
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
 * /interactions/{id}/retweeters?limit=value&offset=value:
 *   get:
 *     summary: get the users who retweet the interaction
 *     tags: [Interactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the interaction
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
 *         description:  list of likers is returned successfully.
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
 *                     lkes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                       id:
 *                         type: string
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
 *                      {
 *                         "users": [
 *                          {
 *                               "id": "123",
 *                              "name": "Eman",
 *                               "username": "EmanElbedwihy",
 *                              "avatar": "http://tweexy.com/images/pic1.png",
 *                               "bio": "CUFE",
 *                              "status": true
 *                               },
 *                              {
 *                               "id": "125",
 *                              "name": "Aya",
 *                               "username": "AyaElbadry",
 *                              "avatar": "http://tweexy.com/images/pic4.png",
 *                               "bio": "pharmacy student HUE",
 *                              "status": false
 *                           }
 *                      ]
 *                     }
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
 *                               "nextPage": "users/blocks?limit=10&offset=10",
 *                               "prevPage": null
 *                             }
 *       404:
 *         description: Not found - no interaction with this id exists.
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
 *                   enum: [no interaction found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'no interaction found.'
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
 */
/**
 * @swagger
 * /interactions/{id}/replies?limit=value&offset=value:
 *   get:
 *     summary: get replies of a certain interaction
 *     tags: [Interactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the interaction
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
 *         description:  replies is returned successfully
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
 *                                   followedByMe:
 *                                     type: boolean
 *                                   followsMe:
 *                                     type: boolean
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
 *                               Irank:
 *                                   type: number
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
 *                           followsMe: true
 *                           followedByMe: false
 *                         likesCount: 1
 *                         viewsCount: 1
 *                         retweetsCount: 0
 *                         commentsCount: 0
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
 *                         Irank: 0.0000027498374644851727
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
 *                         Irank: 0.0000027498374644851727
 *                       parentInteraction: null
 *                 pagination:
 *                            {
 *                               "itemsNumber": 10,
 *                               "nextPage": "/interaction/{id}/replies?limit=10&offset=10",
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
 *       404:
 *         description: Not found - no interaction with this id exists.
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
 *                 message: 'no interaction found.'
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
 * /interactions/{id}/like:
 *   post:
 *     summary: like a interaction
 *     tags: [Interactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the interaction
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       201:
 *         description: like is created successfully
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
 *         description: Not found - no tweet with this id exists.
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
 *                 message: 'no tweet found.'
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
 *                  message: 'user already like the interaction'
 */
/**
 * @swagger
 * /interactions/{id}/replies:
 *   post:
 *     summary: reply on a interaction
 *     tags: [Interactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teewt or reply id
 *         in: path
 *         description: the id of the interaction
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *               - media
 *             properties:
 *               text:
 *                 type: string
 *                 description: The reply content
 *                 example: "This is my first reply #so_cool"
 *               media:
 *                 type: array
 *                 items:
 *                   type:binary
 *                 description: photos or videos included in the reply
 *     responses:
 *       201:
 *         description: reply is created successfully
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
 *                           tweet:
 *                              type: object
 *                              properties:
 *                                    id:
 *                                      type: string
 *                                    text:
 *                                      type: string
 *                                    createdDate:
 *                                      type: Date
 *                                    userID:
 *                                      type: string
 *                           mentionedUserData:
 *                               type: array
 *                               items:
 *                                   type: object
 *                                   properties:
 *                                         id:
 *                                            type: string
 *                                         username:
 *                                                type: string
 *                                         name:
 *                                               type: string
 *                                         email:
 *                                             type: string
 *                           trends:
 *                              type: array
 *                              items:
 *                                  type: string
 *               example:
 *                 status: success
 *                 data:
 *                    {
 *                     tweet:
 *                      {
 *                      "id": "clpd6ro7f0005vilk4n7q2b6b",
 *                      "text": "this is 24",
 *                      "createdDate": "2023-11-24T22:20:33.482Z",
 *                      "userID": "dgp0bzlfe047pvt4yq25d6uzb"
 *                         },
 *                      "mentionedUserData":[{
 *                         "id": "clpewfy340003viikc900obzm",
 *                         "username": "sara_2121",
 *                         "name": "Sara",
 *                         "email": "ibrahim.Eman83@gmail.com",
 *                         }],
 *                      "trends":[
 *
 *                         "fds"
 *                         ]
 *                     }
 *       404:
 *         description: Not found - no tweet with this id exists.
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
 *                 message: 'no interaction found.'
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
 *       400:
 *         description: no reply body.
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
 *                   enum: [no body found.]
 *               example:
 *                 status: 'fail'
 *                 message: 'reply can not be empty.'
 */
/**
 * @swagger
 * /interactions/{id}/retweet:
 *   post:
 *     summary: retweet an interaction
 *     tags: [Interactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the interaction
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *               - media
 *             properties:
 *               text:
 *                 type: string
 *                 description: The tweet content
 *                 example: "This is my first tweet #so_cool"
 *               media:
 *                 type: array
 *                 items:
 *                   type:binary
 *                 description: photos or videos included in the tweet
 *     responses:
 *       201:
 *         description: retweet is created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 data:
 *                     type: object
 *                     properties:
 *                       quote:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           interactionId:
 *                             type: string
 *                           name:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           text:
 *                             type: string
 *                           media:
 *                             type: array
 *                           likesCount:
 *                             type:integer
 *                           commentsCount:
 *                             type:integer
 *                           retweetsCount:
 *                             type:integer
 *                           createdAt:
 *                             type: DateTime
 *                       interaction:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           interactionId:
 *                             type: string
 *                           name:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           text:
 *                             type: string
 *                           media:
 *                             type: array
 *                           likesCount:
 *                             type:integer
 *                           commentsCount:
 *                             type:integer
 *                           retweetsCount:
 *                             type:integer
 *                           createdAt:
 *                             type: DateTime
 *               example:
 *                 status: success
 *                 data: {
 *                          "quote": {
 *                              "userId": "60f6e9a0f0f8a81e0c0f0f8a",
 *                              "interactionId": "60f6e9a0aaf0f8a81e0c0f0f8a",
 *                              "username": "EmanElbedwihy",
 *                              "name": "hany",
 *                              "avatar": "http://tweexy.com/images/pic1.png",
 *                              "text": "wow aliaa so #cool",
 *                              "media": [ "http://tweexy.com/images/pic1.png",  "http://tweexy.com/images/pic2.png"],
 *                              "createdAt": 2023-10-07T16:18:38.944Z,
 *                              "likesCount": 0,
 *                              "commentsCount" :0,
 *                              "retweetsCount" :0
 *                          },
 *                          "interaction": {
 *                              "userId": "60f6e9a0f0f8a81e0c0f0f8a",
 *                              "interactionId": "60f6e9a0aaf0f8a81e0c0f0f8a",
 *                              "username": "EmanElbedwihy",
 *                              "name": "hany",
 *                              "avatar": "http://tweexy.com/images/pic1.png",
 *                              "text": "wow aliaa so #cool",
 *                              "media": [ "http://tweexy.com/images/pic1.png",  "http://tweexy.com/images/pic2.png"],
 *                              "createdAt": 2023-10-07T16:18:38.944Z,
 *                              "likesCount": 2000,
 *                              "commentsCount" :150,
 *                              "retweetsCount" :100
 *                          }
 *                        }
 *
 *       404:
 *         description: Not found - no interaction with this id exists.
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
 *                 message: 'no interaction found.'
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
 */

/**
 * @swagger
 * /interactions/{id}/like:
 *   delete:
 *     summary: Unlike a tweet, comment, retweet
 *     tags:
 *       - Interactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the interactiom
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       201:
 *         description: Like is removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *               example:
 *                 status: success
 *                 data: n
 *       404:
 *         description: Not Found - No interaction with this ID exists.
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
 *               example:
 *                 status: fail
 *                 message: No interaction found
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
 *                 message:
 *                   type: string
 *               example:
 *                 status: error
 *                 message: Internal Server Error
 *       401:
 *         description: Not authorized.
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
 *               example:
 *                 status: fail
 *                 message: User not authorized
 *       409:
 *         description: Conflict - User has not liked this interaction.
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
 *               example:
 *                 status: fail
 *                 message: User can't unlike this interaction
 */

/**
 * @swagger
 * /interactions/{id}:
 *   delete:
 *     summary: delete a tweet, comment, retweet
 *     tags: [Interactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: interaction id
 *         in: path
 *         description: the id of the tweet, comment, retweet
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: interaction is deleted successfully
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
 *                                    id:
 *                                      type: string
 *                                    text:
 *                                      type: string
 *                                    createdDate:
 *                                      type: Date
 *                                    userID:
 *                                      type: string
 *                                    deletedDate:
 *                                      type: Date
 *                                    parentInteractionID:
 *                                      type: string
 *                                    type:
 *                                      type: enum
 *               example:
 *                 data:
 *                    {
 *                      "id": "clpd6ro7f0005vilk4n7q2b6b",
 *                      "text": "this is 24",
 *                      "createdDate": "2023-11-24T22:20:33.482Z",
 *                      "userID": "dgp0bzlfe047pvt4yq25d6uzb",
 *                      "deletedDate": "2023-11-26T03:53:05.770Z",
 *                      "parentInteractionID": null,
 *                      "type": "TWEET",
 *                         }
 *                 status: success
 *       404:
 *         description: Not found - no user or tweet with this id exists.
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
 *                 message: 'no user or tweet found.'
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
 */

const interactionRouter = Router();
interactionRouter
    .route('/:id')
    .delete(
        validateMiddleware(interactionIDSchema),
        auth,
        interactionController.deleteinteraction
    );
interactionRouter
    .route('/:id/likers')
    .get(
        validateMiddleware(interactionIDSchema),
        auth,
        interactionController.getLikers
    );

interactionRouter

    .route('/:id/like')
    .post(
        validateMiddleware(interactionIDSchema),
        auth,
        interactionController.addLike,
        notificationController.addLikeNotification
    );
interactionRouter

    .route('/:id/like')
    .delete(
        validateMiddleware(interactionIDSchema),
        auth,
        interactionController.removeLike
    );

interactionRouter
    .route('/:id/replies')
    .post(
        upload.array('media', 10),
        validateMiddleware(interactionSchema, interactionIDSchema),
        auth,
        interactionController.createReply,
        notificationController.addReplyNotification,
        notificationController.addMentionNotification
    );

interactionRouter
    .route('/:id/replies')
    .get(
        upload.array('media', 10),
        validateMiddleware(interactionIDSchema),
        auth,
        interactionController.getReplies
    );
///interactions/{id}/replies
interactionRouter.route('/').get();

export default interactionRouter;
