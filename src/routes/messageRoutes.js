import { Router } from 'express';


/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: The Conversation managing API
 */

/**
 * @swagger
 * /conversation?limit=value&offset=value/{toID}:
 *   get:
 *     summary: get messages between 2 users
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - name: toID 
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
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
 *                           "text": "did you finish the ER digram?",
 *                           "media": null,
 *                           "createdAt": 2023-10-07T16:18:38.944Z,
 *                           "seen": false
 *                        },
 *                        {
 *                           "text": "hi nesma",
 *                           "media": [pic1,pic2],
 *                           "createdAt": 2023-10-07T16:14:38.944Z,
 *                           "seen": false
 *                        }
 *                      ]
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /conversation?limit=20&offset=20/{toID}
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


/**
 * @swagger
 * /conversation/{toID}:
 *   post:
 *     summary: send or update message between 2 users
 *     tags: [Conversation]
 *     security:
 *       - BearerAuth: [] 
 *     parameters:
 *       - name: toID 
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
 *                 example: [pic1,pic2]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
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
 *                           "media": [pic1,pic2],
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


/**
 * @swagger
 * /conversation?limit=value&offset=value:
 *   get:
 *     summary: get friends who you have chat with and number of unseen conversations
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
 *                     unseenConversationsCount:
 *                       type: integer   
 *                     Conversations:          
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           userName:
 *                             type: string
 *                           cover:
 *                             type: string
 *                           lastMessage:
 *                             type: string
 *                           lastMessageDate:
 *                             type: DateTime
 *                           sender:
 *                             type: string
 *                           unseenMessagesCount:
 *                             type: integer
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
 *                   unseenConversationsCount: 2   
 *                   Conversations: 
 *                      [
 *                        {
 *                           "name": "nehal",
 *                           "userName": "nehal_ali",
 *                           "cover": "pic1",
 *                           "lastMessage": "hellow world",
 *                           "lastMessageDate": 2023-11-07T16:18:38.944Z,
 *                           "sender": "you",
 *                           "unseenMessagesCount": 5
 *                        },
 *                        {
 *                           "name": "Aliaa",
 *                           "userName": "Aliaa_Ghais",
 *                           "cover": "pic2",
 *                           "lastMessage": "SW project is finished",
 *                           "lastMessageDate": 2023-11-07T16:18:38.944Z,
 *                           "sender": "you",
 *                           "unseenMessagesCount": 0
 *                        }
 *                      ]
 *                 pagination:
 *                   itemsNumber: 20
 *                   nextPage: /conversation?limit=2&offset=2
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


const messageRouter = Router();
export default messageRouter;