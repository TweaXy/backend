import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

const tweetSchema = yup.object({
    body: yup.object({
        text: yup
            .string()
            .min(1, 'text must be at least 1 characters')
            .max(280, 'text must be at most 280 characters'),
    }),
});

export { tweetSchema };
