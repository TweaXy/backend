import yup from 'yup';
import { isUUID } from '../utils/index.js';

// Hidden for simplicity

const sendEmailVerificationSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required('email is required field'),
    }),
});

const forgetPasswordSchema = yup.object({
    body: yup.object({
        UUID: yup
            .string()
            .required('UUID is required field')
            .test(
                'is-uuid',
                'email or phone or username is required field',
                isUUID
            ),
    }),
});

export { sendEmailVerificationSchema, forgetPasswordSchema };
