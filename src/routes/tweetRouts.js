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
 *                   type: object
 *                   properties:
 *                     tweets:
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
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     text:
 *                       type: string
 *                     media:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: date
 *                     likesCount:
 *                       type: int
 *                     commentsCount:
 *                       type: int
 *                     retweetsCount:
 *                       type: int
 *               example:
 *                 status: success
 *                 data:
 *                     {
 *                     "id": "60f6e9a0f0f8a81e0c0f0f8a",
 *                     "username": "EmanElbedwihy",
 *                     "name": "hany",
 *                     "avatar": "http://tweexy.com/images/pic4.png",
 *                     "text": "This is my first tweet",
 *                     "media": ["http://tweexy.com/images/pic1.png","http://tweexy.com/images/pic2.png"],
 *                     "createdAt": "2023-10-07T16:18:38.944Z",
 *                     "likesCount": 0,
 *                     "commentsCount": 0,
 *                     "retweetsCount": 0,
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

const tweetRouter = Router();

tweetRouter.route('/').get();

export default tweetRouter;
