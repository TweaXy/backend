import app from './app.js';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error: ${err}`);
    } else {
        console.log('Success listen on port ', PORT);
    }
});

export default server;
