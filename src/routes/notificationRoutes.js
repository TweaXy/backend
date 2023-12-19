import { Router } from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import notificationController from '../controllers/notificationController.js';
import { tokenSchema } from '../validations/tokenSchema.js';
import auth from '../middlewares/auth.js';
import { statusSchema } from '../validations/statusSchema.js';

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: The Notifications managing API
 */

/**
 * @swagger
 * /notification?limit=value&offset=value:
 *   get:
 *     summary: get all notifications of the user
 *     tags: [Notifications]
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
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: get notifications
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
 *                     notifications:
 *                        type: array
 *                        items:
 *                            type: object
 *                            properties:
 *                             createdDate:
 *                                type: data
 *                             action:
 *                                type: string
 *                             interaction:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                     type: string
 *                                  type:
 *                                     type: string
 *                                  text:
 *                                     type: string
 *                                  createdDate:
 *                                     type: date
 *                                  deletedDate:
 *                                     type: date
 *                                  parentInteractionID:
 *                                     type: string
 *                                  userID:
 *                                     type: string
 *                             fromUser:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                     type: string
 *                                  username:
 *                                     type: string
 *                                  name:
 *                                     type: string
 *                                  avatar:
 *                                     type: string
 *                             text:
 *                               type: string
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
 *                   notifications:
 *                         [
 *                           {
 *                              "action": "MENTION",
 *                              "createdDate": 2023-11-07T16:18:38.944Z,
 *                              "interaction":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                                "type": "COMMENT",
 *                                                "text": "lolo @kalawy_123",
 *                                                "createdDate": "2023-12-13T11:36:37.815Z",
 *                                                "deletedDate": null,
 *                                                "parentInteractionID": "clq2ecgde0001a8u2d5k9ts45",
 *                                                "userID": "hwu8na64ngrpxowz6nmqu6af6"
 *                                                },
 *                              "fromUser":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                               "username": "Kalywa@31",
 *                                               "name": "lolo ffwefe",
 *                                               "avatar": "uploads/default.png",
 *                                                },
 *                              "text": "kalawy_123has mentioned you in a TWEET"
 *                            },
 *                           {
 *                              "action": "RETWEET",
 *                              "createdDate": 2023-11-07T16:18:38.944Z,
 *                              "interaction":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                                "type": "COMMENT",
 *                                                "text": "lolo @kalawy_123",
 *                                                "createdDate": "2023-12-13T11:36:37.815Z",
 *                                                "deletedDate": null,
 *                                                "parentInteractionID": "clq2ecgde0001a8u2d5k9ts45",
 *                                                "userID": "hwu8na64ngrpxowz6nmqu6af6"
 *                                                },
 *                              "fromUser":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                               "username": "Kalywa@31",
 *                                               "name": "lolo ffwefe",
 *                                               "avatar": "uploads/default.png",
 *                                                },
 *                              "text": "aliaagheis and others reposted your TWEET"
 *                            },
 *                            {
 *                              "action": "FOLLOW",
 *                              "createdDate": 2023-11-07T16:18:38.944Z,
 *                              "interaction": null,
 *                              "fromUser":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                               "username": "Kalywa@31",
 *                                               "name": "lolo ffwefe",
 *                                               "avatar": "uploads/default.png",
 *                                                },
 *                              "text": "kalawy_123 has followed you "
 *                            },
 *                              {
 *                                "createdDate": "2023-12-15T18:19:28.588Z",
 *                             "action": "REPLY",
 *                             "interaction": {
 *                                     "id": "clq6wxonc0001l9edmgt5tbnd",
 *                                     "type": "TWEET",
 *                                     "text": "Elta_Effertz",
 *                                     "createdDate": "2023-12-15T17:38:23.112Z",
 *                                     "deletedDate": null,
 *                                     "parentInteractionID": null,
 *                                      "userID": "c226m4nfvz1nknx0qtp9lk6r4"
 *                                       },
 *                             "fromUser": {
 *                                      "id": "zzwi74xtbu49ubh68k7i8f61z",
 *                                      "name": "kalawy1",
 *                                      "username": "kalawy_123",
 *                                      "avatar": "uploads/default.png",
 *                                      "bio": null,
 *                                      "followedByMe": false,
 *                                      "followsMe": false
 *                                         },
 *                             "reply": {
 *                                                "id": "clq6yeizf0001hkhcfz9o4fr3",
 *                                                "type": "COMMENT",
 *                                                "text": "kalawy_123",
 *                                                "createdDate": "2023-12-15T18:19:28.537Z",
 *                                                "parentInteractionID": "clq6wxonc0001l9edmgt5tbnd",
 *                                                "userID": "zzwi74xtbu49ubh68k7i8f61z"
 *               },
 *                           "text": "kalawy_123 has replied to your TWEET"
 *           },
 *                           {
 *                              "action": "LIKE",
 *                              "createdDate": 2023-11-07T16:18:38.944Z,
 *                              "interaction":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                                "type": "COMMENT",
 *                                                "text": "lolo @kalawy_123",
 *                                                "createdDate": "2023-12-13T11:36:37.815Z",
 *                                                "deletedDate": null,
 *                                                "parentInteractionID": "clq2ecgde0001a8u2d5k9ts45",
 *                                                "userID": "hwu8na64ngrpxowz6nmqu6af6"
 *                                                },
 *                              "fromUser":
 *                                              {"id": "clq3p4reg000613p8dyxrhqz5",
 *                                               "username": "Kalywa@31",
 *                                               "name": "lolo ffwefe",
 *                                               "avatar": "uploads/default.png",
 *                                                },
 *                              "text": "kalawy_123 has Liked your TWEET"
 *                            },
 *                         ]
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /notifications?limit=20&offset=20
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
 *
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
 * /notification/unseenNotification:
 *   get:
 *     summary: get the count of unseen notifications of the user
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: get count of unseen notifications
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
 *                     count:
 *                       type: integer
 *               example:
 *                 status: success
 *                 data:
 *                   "count": 2
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
 *
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
 * /notification/deviceTokenWeb:
 *   post:
 *     summary: add web device token for sending notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: token of the device .
 *     responses:
 *       200:
 *         description: added successfully
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
 *               example:
 *                 status: success
 *                 data: null
 *       403:
 *         description: Forbidden Request - validation fail.
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
 *                  message: 'token is required'
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
 *
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
 * /notification/deviceTokenAndorid:
 *   post:
 *     summary: add andorid device token for sending notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: token of the device .
 *     responses:
 *       200:
 *         description: added successfully
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
 *               example:
 *                 status: success
 *                 data: null
 *       403:
 *         description: Forbidden Request - validation fail.
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
 *                  message: 'token is required'
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
 *
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
 * /notification/deviceTokenAndorid:
 *   delete:
 *     summary: delete andorid device token for disabling notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: token of the device .
 *     responses:
 *       200:
 *         description: added successfully
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
 *               example:
 *                 status: success
 *                 data: null
 *       403:
 *         description: Forbidden Request - validation fail.
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
 *                  message: 'token is required'
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
 *
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
 * /notification/deviceTokenWeb:
 *   delete:
 *     summary: delete andorid device token for disabling notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: token of the device .
 *     responses:
 *       200:
 *         description: added successfully
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
 *               example:
 *                 status: success
 *                 data: null
 *       403:
 *         description: Forbidden Request - validation fail.
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
 *                  message: 'token is required'
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
 *
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
 * /notification/satatus:
 *   get:
 *     summary: get status of notification setting
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - token
 *               - type
 *             properties:
 *               token:
 *                 type: string
 *                 description: token of the device .
 *              type:
 *                 type: string
 *                 description: token of the device .
 *             example:
 *                   token: "nipcgt82fx19bo92wflzsifhpm"
 *                   type: "android"
 *             example:
 *                   token: "nipcgt82fx19bo92wflzsifhpm"
 *                   type: "web"
 *     responses:
 *       200:
 *         description: added successfully
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
 *                     status:
 *                       type: string
 *               example:
 *                 status: success
 *                 data: 
 *                     status:enabled
 *       403:
 *         description: Forbidden Request - validation fail.
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
 *                  message: 'token is required'
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
 *
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

const notificationRouter = Router();
notificationRouter.route('/').get(auth, notificationController.getNotification);
notificationRouter
    .route('/unseenNotification')
    .get(auth, notificationController.getNotificationCount);

notificationRouter
    .route('/deviceTokenWeb')
    .post(
        validateMiddleware(tokenSchema),
        auth,
        notificationController.addWebToken
    );
notificationRouter
    .route('/deviceTokenAndorid')
    .post(
        validateMiddleware(tokenSchema),
        auth,
        notificationController.addAndoridToken
    );

notificationRouter
    .route('/deviceTokenAndorid')
    .delete(
        validateMiddleware(tokenSchema),
        auth,
        notificationController.deleteAndoridToken
    );

notificationRouter
    .route('/deviceTokenWeb')
    .delete(
        validateMiddleware(tokenSchema),
        auth,
        notificationController.deleteWebToken
    );

    notificationRouter
    .route('/status')
    .get(
        validateMiddleware(statusSchema),
        auth,
        notificationController.checkStatus
    );


export default notificationRouter;
