import conversationService from '../../services/conversationService.js';
import AppError from '../../errors/appError.js';

const sendMessageHandler = async (io, userID, conversationID, text) => {
    // 0. validate
    if (!conversationID || !text) {
        io.to(userID).emit(
            'error',
            new AppError('conversation id or text is missing', 400)
        );
        return;
    }
    if (text.length > 1000) {
        io.to(userID).emit('error', new AppError('message is too long', 400));
        return;
    }
    // 1. check if conversation exist & user is part of it
    const conversation = await conversationService.getUserConversation(
        conversationID,
        userID
    );

    if (!conversation) {
        io.to(userID).emit(
            'error',
            new AppError('conversation not found', 404)
        );
    }

    const secondUserID =
        conversation.user1ID === userID
            ? conversation.user2ID
            : conversation.user1ID;
    // create message
    const message = await conversationService.addConversationMessage(
        conversationID,
        userID,
        secondUserID,
        text,
        []
    );

    io.to(secondUserID).to(userID).emit('message', message);
    io.to(userID).emit('messageSuccess');
};

export default sendMessageHandler;
