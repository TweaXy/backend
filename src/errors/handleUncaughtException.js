import { sendErrorLogEmail } from '../utils/sendEmail.js';

// handle synchronus uncaught exceptions
process.on('uncaughtException', async (err) => {
    try {
        console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
        console.log({ name: err.name, message: err.message, stack: err.stack });

        // Send email asynchronously without blocking the process
        await sendErrorLogEmail(err);
    } finally {
        // Perform any necessary cleanup before exiting
        process.exit(1);
    }
    //TODO: restart server after 10 seconds
});
