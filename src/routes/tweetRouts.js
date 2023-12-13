import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createTweet } from '../controllers/tweetController.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { interactionSchema } from '../validations/interactionSchema.js';
import upload from '../middlewares/addMedia.js';
import notificationController from '../controllers/notificationController.js';
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
        createTweet,
        notificationController.addMentionNotification
    );

tweetRouter.route('/').get();

export default tweetRouter;
