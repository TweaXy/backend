import { Router } from 'express';
import homeController from '../controllers/homeController.js';
import auth from '../middlewares/auth.js';
/**
 * @swagger
 * tags:
 *   name: Home
 *   description: The Home managing API
 */
/**
 * @swagger
 * /home?limit=value&offset=value:
 *   get:
 *     summary: get the tweets | retweets of your following or related to your interests
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
 *                               Irank:
 *                                   type: number
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
 *                         Irank: 0.0000027498374644851727
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
 *                         Irank: 0.0000027498374644851727
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
 *                         Irank: 0.0000027498374644851727
 *                       parentInteraction: null
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

const homeRouter = Router();

homeRouter.get('/', auth, homeController.getUserTimeline);
export default homeRouter;
