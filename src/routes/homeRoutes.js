import { Router } from 'express';


/**
 * @swagger
 * tags:
 *   name: Home
 *   description: The Home managing API
 */

/**
 * @swagger
 * /home?limit=value&offset=value/following:
 *   get:
 *     summary: get the tweets of your following
 *     tags: [Home]
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
 *     responses:
 *       200:
 *         description: get following timeline
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
 *                           "name": "hany",
 *                           "text": "hello world",
 *                           "media": null,
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "likesCount": 2000,
 *                           "commentsCount" :150,
 *                           "retweetsCount" :100
 *                        },
 *                        {
 *                           "name": "Asmaa",
 *                           "text": "back to school",
 *                           "media": null,
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "likesCount": 100,
 *                           "commentsCount" :150,
 *                           "retweetsCount" :100
 *                        }
 *                      ]
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /conversation?limit=20&offset=20/{toID}
 *                   prevPage: null
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
 *      
 */



const homeRouter = Router();
export default homeRouter;