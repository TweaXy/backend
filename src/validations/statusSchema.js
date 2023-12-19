import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

const statusSchema = yup.object({
    body: yup.object({
        token: yup.string().required('token is required'),
        type: yup.string().required('type is required'),
    }),
});

export { statusSchema };
