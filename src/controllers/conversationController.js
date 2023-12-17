import conversationService from '../services/conversationService.js';
import userService from '../services/userService.js';
import { catchAsync, pagination } from '../utils/index.js';
import AppError from '../errors/appError.js';
const getUserConversations = catchAsync(async (req, res, next) => {
    //  paginate through the conversations
    const data = await pagination(
        req,
        'conversations',
        conversationService.getUserConversationsSchema(req.user.id)
    );
    data.data.items = conversationService.mapUserConversations(data.data.items);

    return res.json({ status: 'success', ...data });
});

const createConversation = catchAsync(async (req, res, next) => {
    const { UUID } = req.body;
    // 1. check if user is exist
    const user = await userService.getUserByUUID(UUID, {
        id: true,
    });

    if (!user) {
        return next(new AppError('the second user not found', 404));
    }
    // 2. check if conversation exist
    const checkConversationExists =
        await conversationService.checkConversationExistUsingUsers(
            req.user.id,
            user.id
        );

    if (checkConversationExists) {
        return next(new AppError('conversation already exist', 400));
    }

    // 3. if not create a new conversation
    const conversation = await conversationService.createCoversation(
        req.user.id,
        user.id
    );

    return res.json({
        status: 'success',
        data: { conversationID: conversation.id },
    });
});

const createConversationMessage = catchAsync(async (req, res, next) => {
    const { id: conversationID } = req.params;
    const { text } = req.body;
    // check if message is empty
    if (!text && (req.files == null || req.files.length <= 0)) {
        return next(new AppError('message can not be empty', 403));
    }
    // check if conversation exist & user is part of it
    const conversation = await conversationService.getUserConversation(
        conversationID,
        req.user.id
    );
    if (!conversation) {
        return next(new AppError('conversation not found for this user', 404));
    }
    // create message
    const message = await conversationService.addConversationMessage(
        conversationID,
        req.user.id,
        conversation.user1ID === req.user.id
            ? conversation.user2ID
            : conversation.user1ID,
        text,
        req.files
    );

    // return message
    return res.json({
        status: 'success',
        data: message,
    });
});

const getCovnersationMessages = catchAsync(async (req, res, next) => {
    const { id: conversationID } = req.params;

    // 1. check if conversation exist & user is part of it
    const conversation = await conversationService.getUserConversation(
        conversationID,
        req.user.id
    );

    if (!conversation) {
        return next(new AppError('conversation not found for this user', 404));
    }
    // 2. get pagination
    const paginationData = await pagination(
        req,
        'directMessages',
        conversationService.getCovnersationMessagesSchema(conversationID)
    );
    // 3. set seen messages
    await conversationService.setSeenMessages(conversationID, req.user.id);
    // 4. return messages
    return res.json({ status: 'success', ...paginationData });
});

const getUnseenConversations = catchAsync(async (req, res, next) => {
    const data = await conversationService.getUnseenConversationsCount(
        req.user.id
    );
    return res.json({ status: 'success', data: { unseenConversations: data } });
});


export default {
    getUserConversations,
    getCovnersationMessages,
    createConversation,
    createConversationMessage,
    getUnseenConversations,
 
};
