import { Router } from 'express';
import auth from '../middlewares/auth.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
    addConversationSchema,
    addMessageSchema,
} from '../validations/conversationSchema.js';
import upload from '../middlewares/addMedia.js';
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
 *                               bio:
 *                                 type: string
 *                               _count:
 *                                 type: object
 *                                 properties:
 *                                   followedBy:
 *                                     type: integer
 *                                   following:
 *                                     type: integer
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
 *                               bio:
 *                                 type: string
 *                               _count:
 *                                 type: object
 *                                 properties:
 *                                   followedBy:
 *                                     type: integer
 *                                   following:
 *                                     type: integer
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
 *                         bio: null
 *                         _count:
 *                           followedBy: 2
 *                           following: 3
 *                       user2:
 *                         id: "isclckz2oz34beevpebgr5qib"
 *                         name: "Virgie"
 *                         username: "Sunny_Wuckert"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                         bio: null
 *                         _count:
 *                           followedBy: 2
 *                           following: 3
 *                       unseenCount: 0
 *                       lastMessage: null
 *                     - id: "clq78l8az0001xnf8kdxgened"
 *                       user1:
 *                         id: "dggpoco6hc5tmqtef1bgcqxai"
 *                         name: "kalawy1"
 *                         username: "kalawy_123"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                         bio: null
 *                         _count:
 *                           followedBy: 2
 *                           following: 3
 *                       user2:
 *                         id: "i7mla142aiqgzxn9quefe1gli"
 *                         name: "Marquis"
 *                         username: "Maximilian_Hackett"
 *                         avatar: "d1deecebfe9e00c91dec2de8bc0d68bb"
 *                         bio: null
 *                         _count:
 *                           followedBy: 2
 *                           following: 3
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
 *     summary: get messages of conversation
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of conversation
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
 *                          id:
 *                            type: string
 *                          conversationID:
 *                            type: string
 *                          senderId:
 *                            type: string
 *                          receiverId:
 *                            type: string
 *                          text:
 *                            type: string
 *                          media:
 *                            type: array
 *                            items:
 *                              type: string
 *                          createdDate:
 *                            type: DateTime
 *                          seen:
 *                            type: boolean
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
 *                         "items": [
 *                             {
 *                                 "id": "clq7e7ej30001klxhgpma2910",
 *                                 "conversationID": "clq79hx5w00018lw2lm8zd1rg",
 *                                 "text": "cool unseen message 3",
 *                                 "seen": true,
 *                                 "createdDate": "2023-12-16T01:41:50.032Z",
 *                                 "senderId": "bezy4bozh5uiwdvz1q4llt8r6",
 *                                 "receiverId": "yhux3msz98ivi1vsbdtw9d3t8",
 *                                 "media": []
 *                             },
 *                             {
 *                                 "id": "clq7e3fpk0005qjn7myzmxujl",
 *                                 "conversationID": "clq79hx5w00018lw2lm8zd1rg",
 *                                 "text": "cool unseen message 2",
 *                                 "seen": true,
 *                                 "createdDate": "2023-12-16T01:38:44.936Z",
 *                                 "senderId": "bezy4bozh5uiwdvz1q4llt8r6",
 *                                 "receiverId": "yhux3msz98ivi1vsbdtw9d3t8",
 *                                 "media": [
 *                                     {
 *                                         "fileName": "c88e14dbf2b128cd778ec55afc7b8f9f"
 *                                     },
 *                                     {
 *                                         "fileName": "d260fae7351afdc82d7c54b8e9d34dcd"
 *                                     }
 *                                 ]
 *                             }
 *                         ]
 *                     }
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
 *       404:
 *         description: Not found - no user exist (auth | no conversation for this user exist).
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
 *                 message: 'conversation not found for this user'
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
 *     summary: add message to user
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: the id of conversation
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
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
 *         description: successfully create message
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
 *                       id:
 *                         type: string
 *                         description: The message id
 *                       conversationID:
 *                         type: string
 *                         description: The conversation id
 *                       text:
 *                         type: string
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                       senderId:
 *                         type: string
 *                       receiverId:
 *                         type: string
 *                       createdAt:
 *                         type: DateTime
 *                       seen:
 *                         type: boolean
 *               example:
 *                 status: success
 *                 data:
 *                        {
 *                           "id": "clq79jwhb0001d0bjluluu40u",
 *                           "conversationID": "clq79hx5w00018lw2lm8zd1rg",
 *                           "text": "cool",
 *                           "seen": false,
 *                           "createdDate": "2023-12-15T23:31:35.087Z",
 *                           "senderId": "yhux3msz98ivi1vsbdtw9d3t8",
 *                           "receiverId": "bezy4bozh5uiwdvz1q4llt8r6",
 *                           "media": [
 *                               {
 *                                   "fileName": "44feb60d66b0e7c81ba4d92b201d668c"
 *                               },
 *                               {
 *                                   "fileName": "9c0a52817eea634b29ae292858a5ee01"
 *                               }
 *                           ]
 *                       }
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
 *                  message: 'message can not be empty'
 *       404:
 *         description: Not found - no user or conversation with this id exists.
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
 *                 message: 'conversation not found for this user.'
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
    .get(auth, conversationController.getCovnersationMessages)
    .post(
        auth,
        upload.array('media', 10),
        validateMiddleware(addMessageSchema),
        conversationController.createConversationMessage
    );
export default conversationsRouter;
