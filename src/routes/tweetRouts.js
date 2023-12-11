import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
    createTweet,
    searchForTweets,
} from '../controllers/tweetController.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { interactionSchema } from '../validations/interactionSchema.js';
import upload from '../middlewares/addMedia.js';
/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: The Tweets managing API
 */

/**
 * @swagger
 * /tweets/search/{keyword}?id=value&limit=value&offset=value:
 *   get:
 *     summary: search for tweets
 *     tags: [Tweets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: keyword
 *         in: path
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
 *       - name: id
 *         in: query
 *         description: id of the user whom tweets are searched for(for mobile only).
 *         required: false
 *         schema:
 *           type: string
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
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
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
 *                         isUserInteract:
 *                           isUserLiked: 1
 *                           isUserRetweeted: 1
 *                           isUserCommented: 1
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
 *                         isUserInteract:
 *                           isUserLiked: 0
 *                           isUserRetweeted: 0
 *                           isUserCommented: 1
 *                         Irank: 0.0000027498374644851727
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
 *       404:
 *         description: Not found - no user with this id exists(for id which is sent in body).
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
 *                 example: "This is my first tweet #dfg  @blabla"
 *               media:
 *                 type: array
 *                 properties:
 *                      files:
 *                          type: string
 *                          format: binary
 *                 description: photos or videos included in the tweet
 *                 example:
 *                    - photo.png
 *                    - photo2.png
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
 *                           media:
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
 *                         ],
 *                      "media": [
 *                           "uploads\\tweetsMedia\\Screenshot 2023-10-04 052738.png_1701438906312.png",
 *                            "uploads\\tweetsMedia\\Screenshot 2023-10-10 113348.png_1701438906318.png"
 *                                  ]
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
 *       400:
 *         description: no tweet body.
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
 *                   enum: [tweet can not be empty.]
 *               example:
 *                 status: 'fail'
 *                 message: 'tweet can not be empty.'
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
tweetRouter
    .route('/')
    .post(
        upload.array('media', 10),
        validateMiddleware(interactionSchema),
        auth,
        createTweet
    );

tweetRouter.route('/').get();

tweetRouter.route('/search/:keyword').get(auth, searchForTweets);

export default tweetRouter;
