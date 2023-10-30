import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: The Tweets managing API
 */

/**
 * @swagger
 * /tweets:
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
 *                 description: photos or videos included in the tweet
 *                 example: [[21,23,43],[44,56,76]]
 *               mentions:
 *                 type: array
 *                 description: mentions in the tweet
 *                 example: ["@bla","@anything"]
 *               trends:
 *                 type: array
 *                 description: hashtags in the tweet
 *                 example: ["#bla","#anything"]
 *     responses:
 *       201:
 *         description: create the tweet
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
 *                         type: array
 *                         items:
 *                           type: bytes
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
 *                     "media": [[21,23,43],[44,56,76]],
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
 * /tweets/tweetid:
 *   delete:
 *     summary: delete a tweet  
 *     tags: [Tweets]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: teewt id
 *         in: query
 *         description: the id of the tweet
 *         required: true
 *         schema:
 *           type: string 
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: delete tweet
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
 * /tweets/:tweetid/replies:
 *   get:
 *     summary: get replies of a certain tweet
 *     tags: [Tweets]
 *     parameters:
 *       - name: tweet id
 *         in: query
 *         description: the id of the tweet
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: get replies
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
 *                         type: bytes
 *                       createdAt:
 *                         type: Date
 *                       text:
 *                         type: string
 *                       media:
 *                         type: array
 *                         items:
 *                           type: array
 *                           items:
 *                             type: bytes
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
 *               example:
 *                 status: success
 *                 data: 
 *                      [
 *                        {
 * 
 *                           "name": "Eman",
 *                           "username": "EmanElbedwihy",
 *                           "avatar": [34,67,89],
 *                           "createdAt":22-10-2023,
 *                           "text": "this in text",
 *                           "media": [[21,43,76],[33,76,65]],
 *                           "mentions": ["@bla", "@anything"],
 *                           "trends": ["@bla", "@anything"],
 *                           "likes": 10,
 *                           "reposts": 2,
 *                           "replies": 5
 * 
 *                        },
 *                        {
 *                           "name": "Aya",
 *                           "username": "AyaElbadry",
 *                           "avatar": [34,67,89],
 *                           "createdAt":29-10-2023,
 *                           "text": "this in blabla",
 *                           "media": [[21,43,76],[33,76,65]],
 *                           "mentions": ["@anything"],
 *                           "trends": [],
 *                           "likes": 5,
 *                           "reposts": 1,
 *                           "replies": 3
 * 
 *                        }
 *                      ]
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
 *      
 */
const tweetRouter = Router();

tweetRouter.route('/').get();

export default tweetRouter;
