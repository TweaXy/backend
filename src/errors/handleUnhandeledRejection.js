// handle uncaught promise rejection
process.on('unhandledRejection', async (err) => {
    console.log('UNHANDELED REJECTION! 💥 Shutting down...');
    console.log({ name: err.name, message: err.message, stack: err.stack });
    // close server then exit process
    // to not reject other pending requests
    // server.close(() => {
    //     process.exit(1);
    // });
    //await sendErrorLogEmail(err);
    //TODO: restart server after 10 seconds
});
