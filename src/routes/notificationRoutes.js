import { Router } from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import notificationController from '../controllers/notificationController.js';
import { tokenSchema } from '../validations/tokenSchema.js';
import auth from '../middlewares/auth.js';

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
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           interactionId:
 *                             type: string
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           action:
 *                             type: string
 *                           date:
 *                             type: DateTime
 *                           interaction:
 *                             type: string
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
 *                   items:
 *                         [
 *                           {
 *                              "userId": "122334asa",
 *                              "interactionId": "12345",
 *                              "name": "nehal",
 *                              "action": "like",
 *                              "avatar": "http://tweexy.com/images/pic4.png",
 *                              "date": 2023-11-07T16:18:38.944Z,
 *                              "interaction": "hello world from another world"
 *                           },
 *                           {
 *                              "userId": "122334asaa",
 *                              "interactionId": "123455",
 *                              "name": "aliaa",
 *                              "action": "reply",
 *                              "avatar": "http://tweexy.com/images/pic4.png",
 *                              "date": 2023-11-07T16:18:38.944Z,
 *                              "interaction": "bla bla text of interaction"
 *                           }
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
 * /notifications/unseenNotification:
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

const notificationRouter = Router();

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

notificationRouter.route('/').get(auth, notificationController.getNotiication);
export default notificationRouter;
