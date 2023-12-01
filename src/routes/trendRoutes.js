import { Router } from 'express';
import trendController from '../controllers/trendController.js';
import auth from '../middlewares/auth.js';
/**
 * @swagger
 * tags:
 *   name: Trends
 *   description: The Trends managing API
 */
/**
 * @swagger
 * /trends?limit=value&offset=value:
 *   get:
 *     summary: get top trends
 *     tags: [Trends]
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
 *         description: successfully -  list of trends is returned .
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
 *                   trends:
 *                     type: array
 *                     properties:
 *                       trend:
 *                         type: string
 *                       count:
 *                         type: integer
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
 *                 status: success
 *                 data:
 *                   items:
 *                     - trend: aliaa_coolness
 *                       count: 1000
 *                     - trend: aliaa_awesomeness
 *                       count: 999
 *                     - trend: aliaa_magnificence
 *                       count: 998
 *                 pagination:
 *                   totalCount: 9
 *                   itemsCount: 3
 *                   nextPage: null
 *                   prevPage: "http://localhost:3000/api/v1/home/?limit=3&offset=3"
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
 * /trends/{id}?limit=value&offset=value:
 *   get:
 *     summary: get top tweets in this trend
 *     tags: [Trends]
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
 *         description: successfully -  list of tweets is returned .
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
 *                   tweets:
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
 *                      {
 *                        tweets: [
 *                        {
 *                          "tweetId": "60f6e9a0f0f8a81e0c0f0f8a",
 *                           "username": "EmanElbedwihy",
 *                           "name": "hany",
 *                           "avatar": "http://tweexy.com/images/pic1.png",
 *                           "text": "wow aliaa so #cool",
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
 *                           "text": "I am so #cool",
 *                           "media": null,
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "likesCount": 100,
 *                           "commentsCount" :150,
 *                           "retweetsCount" :100
 *                        }
 *                      ]
 *                   }
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /trends/{id}?query="*cool*"&limit=20&offset=20
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

const trendRouter = Router();

trendRouter.route('/').get(auth, trendController.getTrendInteractions);

export default trendRouter;
