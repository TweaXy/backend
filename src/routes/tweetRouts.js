import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: The Tweets managing API
 */

/**
 * @swagger
 * /tweets/search?query=value&limit=value&offset=value:
 *   get:
 *     summary: search for tweets
 *     tags: [Tweets]
 *     parameters:
 *       - name: query
 *         in: query
 *         description: query to search for
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
 *         description: get tweets that match the query
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
 * /interactions/{id}/likes?limit=value&offset=value:
 *   get:
 *     summary: get the users who likes interaction
 *     tags: [Tweets]
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
 * /interaction/{id}/retweeters?limit=value&offset=value:
 *   get:
 *     summary: get the users who retweet the interaction
 *     tags: [Tweets]
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
 * /tweets/:
 *   post:
 *     summary: create a tweet
 *     tags: [Tweets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *               - media
 *               - mentions
 *               - trends
 *             properties:
 *               text:
 *                 type: string
 *                 description: The tweet text content
 *                 example: "This is my first tweet"
 *               media:
 *                 type: array
 *                 items:
 *                   type:string
 *                 description: photos or videos included in the tweet
 *                 example: ["http://tweexy.com/images/pic1.png","http://tweexy.com/images/pic2.png"]
 *               mentions:
 *                 type: array
 *                 items:
 *                   type:string
 *                 description: mentions in the tweet
 *                 example: ["@bla","@anything"]
 *               trends:
 *                 type: array
 *                 items:
 *                   type:string
 *                 description: hashtags in the tweet
 *                 example: ["#bla","#anything"]
 *     responses:
 *       201:
 *         description: tweet is created successfully
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
 *                     text:
 *                       type: string
 *                     media:
 *                       type: array
 *                       items:
 *                         type: string
 *                     mentions:
 *                        type: array
 *                        items:
 *                          type:string
 *                     ternds:
 *                        type: array
 *                        items:
 *                          type:string
 *               example:
 *                 status: success
 *                 data:
 *                     {
 *                     "text": "This is my first tweet",
 *                     "media": ["http://tweexy.com/images/pic1.png","http://tweexy.com/images/pic2.png"],
 *                     "mentions": ["@bla","@anything"],
 *                     "trends": ["#bla","#anything"]
 *                     }
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
 */

/**
 * @swagger
 * /interaction/{id}:
 *   delete:
 *     summary: delete a tweet, comment, retweet
 *     tags: [Tweets]
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
 *                   description: null
 *               example:
 *                 status: success
 *                 data: null
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
 */

/**
 * @swagger
 * /interaction/{id}/replies?limit=value&offset=value:
 *   get:
 *     summary: get replies of a certain interaction
 *     tags: [Tweets]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       interactionId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
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
 *                           "interactionId": "60f6e9a0f0f8a81e0c0f0f8a",
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "createdAt":22-10-2023,
 *                           "text": "this in text",
 *                           "media": ["http://tweexy.com/images/pic2.png","http://tweexy.com/images/pic3.png"],
 *                           "mentions": ["@bla", "@anything"],
 *                           "trends": ["@bla", "@anything"],
 *                           "likes": 10,
 *                           "reposts": 2,
 *                           "replies": 5
 *
 *                        },
 *                        {
 *                           "interactionId": "60f6e9a0f0f8a81e0c0f0f8a",
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": "http://tweexy.com/images/pic4.png",
 *                           "createdAt":29-10-2023,
 *                           "text": "this in blabla",
 *                           "media": [],
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
 *                               "nextPage": "/interaction/{id}/replies?limit=10&offset=10",
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
 * /interaction/{id}/like:
 *   post:
 *     summary: like a interaction
 *     tags: [Tweets]
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
 */
/**
 * @swagger
 * /interaction/{id}/replies:
 *   post:
 *     summary: reply on a interaction
 *     tags: [Tweets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: teewt id
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
 *                 example: "This is my first tweet #so_cool"
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
 *                     type: object
 *                     properties:
 *                       id:
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
 *               example:
 *                 status: success
 *                 data: {
 *                          "id": "60f6e9a0f0f8a81e0c0f0f8a",
 *                           "username": "EmanElbedwihy",
 *                           "name": "hany",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "text": "wow aliaa so #cool",
 *                           "media": [ "http://tweexy.com/images/pic1.png",  "http://tweexy.com/images/pic2.png"],
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "likesCount": 2000,
 *                           "commentsCount" :150,
 *                           "retweetsCount" :100
 *                        }
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
 */
/**
 * @swagger
 * /interaction/{id}/retweet:
 *   post:
 *     summary: retweet an interaction
 *     tags: [Tweets]
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
 * /interaction/{id}/like:
 *   delete:
 *     summary: Unlike a tweet, comment, retweet
 *     tags:
 *       - Tweets
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
 *                 data: null
 *                 message: Like removed successfully
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

const tweetRouter = Router();

tweetRouter.route('/').get();

export default tweetRouter;
