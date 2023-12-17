import app from './app.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import authSocket from './middlewares/authSocket.js';
import socketMain from './socket/index.js';
dotenv.config({ path: './.env' });

const PORT = 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.use(authSocket);

io.on('connection', (socket) => {
    socketMain(io, socket);
});

server.listen(PORT, (err) => {
    if (err) {
        console.error(`Error: ${err}`);
    } else {
        console.log('Success listen on port ', PORT);
    }
});
export default server;
