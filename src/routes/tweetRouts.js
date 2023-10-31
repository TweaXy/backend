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
 * /tweets/{tweetid}:
 *   delete:
 *     summary: delete a tweet  
 *     tags: [Tweets]
 *     security:
 *       - BearerAuth: []   
 *     parameters:
 *       - name: teewt id
 *         in: path
 *         description: the id of the tweet
 *         required: true
 *         schema:
 *           type: string 
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: tweet is deleted successfully
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
 * /tweets/{tweetid}/replies?limit=value&offset=value:
 *   get:
 *     summary: get replies of a certain tweet
 *     tags: [Tweets]
 *     parameters:
 *       - name: tweet id
 *         in: path
 *         description: the id of the tweet
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
 * 
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
 *                               "nextPage": "users/blocks?limit=10&offset=10",
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
