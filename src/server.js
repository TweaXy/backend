import app from './app.js';
import dotenv from 'dotenv';
import cron from 'node-cron';
import expiredDataService from './services/expiredDataService.js';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error: ${err}`);
    } else {
        console.log('Success listen on port ', PORT);
    }
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
