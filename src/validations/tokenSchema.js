import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

const tokenSchema = yup.object({
    body: yup.object({
        token: yup.string().required('token is required'),
    }),
});

export { tokenSchema };
