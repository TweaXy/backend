import server from '../server.js';
// handle uncaught promise rejection
process.on('unhandeledRejection', (err) => {
    console.log('UNHANDELED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    // close server then exit process
    // to not reject other pending requests
    server.close(() => {
        process.exit(1);
    });
    //TODO: restart server after 10 seconds
});
