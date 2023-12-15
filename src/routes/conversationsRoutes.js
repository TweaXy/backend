import { Router } from 'express';
import auth from '../middlewares/auth.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    addConversationSchema,
    addMessageSchema,
} from '../validations/conversationSchema.js';
import conversationController from '../controllers/conversationController.js';

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: The Conversation managing API
 */

/**
 * @swagger
 * /conversations?limit=value&offset=value:
 *   get:
 *     summary: get user conversations detials
 *     tags: [Conversation]
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
 *         description: get conversations
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
 *                           id:
 *                             type: string
 *                           user1:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           user2:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           unseenCount:
 *                             type: integer
 *                           lastMessage:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               text:
 *                                 type: string
 *                               createdDate:
 *                                 type: string
 *                               seen:
 *                                 type: boolean
 *                               media:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               sender:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                   username:
 *                                     type: string
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
 *                     - id: "clq78vzuy00014px0zqdg105b"
 *                       user1:
 *                         id: "dggpoco6hc5tmqtef1bgcqxai"
 *                         name: "kalawy1"
 *                         username: "kalawy_123"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                       user2:
 *                         id: "isclckz2oz34beevpebgr5qib"
 *                         name: "Virgie"
 *                         username: "Sunny_Wuckert"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                       unseenCount: 0
 *                       lastMessage: null
 *                     - id: "clq78l8az0001xnf8kdxgened"
 *                       user1:
 *                         id: "dggpoco6hc5tmqtef1bgcqxai"
 *                         name: "kalawy1"
 *                         username: "kalawy_123"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                       user2:
 *                         id: "i7mla142aiqgzxn9quefe1gli"
 *                         name: "Marquis"
 *                         username: "Maximilian_Hackett"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                       unseenCount: 0
 *                       lastMessage:
 *                         id: "clq78qi0t0001cyx2ycgchccb"
 *                         text: "wow my first message"
 *                         createdDate: "2023-12-15T23:08:43.326Z"
 *                         seen: false
 *                         media: []
 *                         sender:
 *                           id: "dggpoco6hc5tmqtef1bgcqxai"
 *                           username: "kalawy_123"
 *                   pagination:
 *                     totalCount: 3
 *                     itemsCount: 2
 *                     nextPage: "http://localhost:3000/api/v1/conversations/?limit=2&offset=2"
 *                     prevPage: null
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
 * /conversations:
 *   post:
 *     summary: Create conversation between two users
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - UUID
 *
 *             properties:
 *               UUID:
 *                 type: string
 *                 description: unique user identifer it could an email or username or phone.
 *                 format: email | username | phone
 *                 example: "aliaagheis"
 *     responses:
 *       200:
 *         description: successfully create conversation
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
 *                     conversationID:
 *                       type: string
 *               example:
 *                 status: success
 *                 data:
 *                   conversationID: "clq741x2n0001pxu0yytzj6w7"
 *       400:
 *         description: Bad Request - Invalid parameters provided or conversation already exists
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
 *                 message: 'Invalid parameters provided or conversation already exists'
 *       401:
 *         description: Not authorized - User not authenticated
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
 *         description: Not found - No user with this ID exists
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
 * /conversations/{id}?limit=value&offset=value:
 *   get:
 *     summary: get messages between 2 users
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the user who will recieve the message
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
 *         description: get messages
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
 *                     messages:
 *                      type: array
 *                      items:
 *                        type: array
 *                        properties:
 *                          userId:
 *                            type: string
 *                          text:
 *                            type: string
 *                          media:
 *                            type: array
 *                            items:
 *                              type: string
 *                          createdAt:
 *                            type: DateTime
 *                          seen:
 *                            type: boolean
 *                      otherUserData:
 *                        userId:
 *                          type: string
 *                        username:
 *                          type: string
 *                        name:
 *                          type: string
 *                        bio:
 *                          type: string
 *                        avatar:
 *                          type: string
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
 *                        messages: [
 *                          {
 *                            "userId" : "1234",
 *                             "text": "did you finish the ER digram?",
 *                             "media": null,
 *                             "createdAt": 2023-10-07T16:18:38.944Z,
 *                             "seen": false
 *                          },
 *                          {
 *                            "userId" : "123455",
 *                             "text": "hi nesma",
 *                             "media": ["http://tweexy.com/images/pic4.png","http://tweexy.com/images/pic5.png"],
 *                             "createdAt": 2023-10-07T16:14:38.944Z,
 *                             "seen": false
 *                          }
 *                        ],
 *                        otherUserData: {
 *                          userId: "123455",
 *                          username: "aliaagheis",
 *                          name: "aliaa",
 *                          bio: "wow I am toturing nesma",
 *                          avatar: "http://tweexy.com/images/pic4.png",
 *                        }
 *                      }
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /conversation?limit=20&offset=20/{toID}
 *                   prevPage: null
 *       400:
 *         description: Bad Request - Conversation already exist
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
 *                 message: 'conversation already exis'
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
 *                  message: 'UUID is required field'
 *       404:
 *         description: Not found - no user exist (auth | no user with uuid exist).
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
 *                 message: 'the second user not found'
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
 * /conversations/{id}:
 *   post:
 *     summary: send or update message between 2 users
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of the user who recieved the message
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The message text content
 *                 example: "This is my first message"
 *               media:
 *                 type: array
 *                 description: photos or videos included in the message
 *                 example: null
 *     responses:
 *       200:
 *         description: send or update message
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
 *                       text:
 *                         type: string
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: DateTime
 *                       seen:
 *                         type: boolean
 *               example:
 *                 status: success
 *                 data:
 *                        {
 *                           "text": "did you finish the ER digram?",
 *                           "media": ["http://tweexy.com/images/pic4.png","http://tweexy.com/images/pic5.png"],
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "seen": false
 *                        }
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
 *
 */

const conversationsRouter = Router();
conversationsRouter
    .route('/')
    .get(auth, conversationController.getUserConversations)
    .post(
        auth,
        validateMiddleware(addConversationSchema),
        conversationController.createConversation
    );

conversationsRouter
    .route('/:id')
    .get(auth, conversationController.getUserConversations)
    .post(
        auth,
        validateMiddleware(addMessageSchema),
        conversationController.createConversationMessage
    );
export default conversationsRouter;
