import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

const tweetSchema = yup.object({
    body: yup.object({
        text: yup.string(),
    }),
});

export { tweetSchema };
