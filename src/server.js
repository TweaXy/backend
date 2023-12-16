import app from './app.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import expiredDataService from './services/expiredDataService.js';
import { Server } from 'socket.io';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error: ${err}`);
    } else {
        console.log('Success listen on port ', PORT);
    }
});

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('joinConversation', (data) => {
        console.log('joinConversation', data);
        const { token, conversationID, username } = data;
        // check if user is authenticated
        // check if there's conversation exists within user
        socket.join(conversationID);
        io.to(conversationID).emit(
            'roomJoined',
            `${socket.id} just joined the room`
        );
    });

    socket.on('leaveRoom', (data) => {
        const { conversationID, username } = data;
        console.log('leaveRoom', data);
        socket.leave(conversationID);
        io.to(conversationID).emit(
            'roomLeft',
            `${username} just left the room`
        );
    });

    socket.on('sendMessage', (data) => {
        const { conversationID, username, message } = data;
        console.log('sendMessage', data);
        io.to(conversationID).emit('messageReceived', {
            username,
            message,
        });
    });
    io.emit(1, 'some data');

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });

    // We can write our socket event listeners in here...
});

cron.schedule('0 0 * * *', async function () {
    try {
        console.log('start cron job');
        // delete expired blocked tokens
        console.log(expiredDataService.deleteExpiredBlockedTokens());
        // delete expired email verification tokens
        console.log(expiredDataService.deleteExpiredVerificationTokens());
        // delete expired reset password tokens
        console.log(expiredDataService.deleteExpiredResetPasswordTokens());
        // delete expired [trends - interactions - user] data
        console.log(expiredDataService.deleteSoftData());
    } catch (error) {
        console.error('Error in cron job 🤯: ', error);
    }
});
export default server;
