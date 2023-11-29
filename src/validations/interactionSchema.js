import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

const interactionSchema = yup.object({
    body: yup.object({
        text: yup.string(),
    }),
});

export { interactionSchema };
