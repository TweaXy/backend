import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

const interactionSchema = yup.object({
    body: yup.object({
        text: yup
            .string()
            .min(1, 'text must be at least 1 characters')
            .max(280, 'text must be at most 280 characters'),
    }),
});

const interactionIDSchema = yup.object({
    params: yup.object({
        id: yup.string().required('id is required field'),
    }),
});
export { interactionSchema, interactionIDSchema };
