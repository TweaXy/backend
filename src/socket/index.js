import sendMessageHandler from './handlers/sendMessageHandler.js';
const socketMain = async (io, socket) => {
    console.log(
        socket.id + ' connected' + ' username: ' + socket.user.username
    );

    // make a room with user id
    socket.join(socket.user.id);

    io.to(socket.user.id).emit('joined', 'user signed in successfully');
    // on send message
    socket.on('sendMessage', async ({ conversationID, text }) => {
        await sendMessageHandler(io, socket.user.id, conversationID, text);
    });
    // on disconnect
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
};

export default socketMain;
