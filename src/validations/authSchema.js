import yup from 'yup';

// Hidden for simplicity

const sendEmailVerificationSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required('email is required field'),
    }),
});

const forgetPasswordSchema = yup.object({
    body: yup.object({
        uniqueIdentifier: yup
            .mixed()
            .oneOf([
                yup.string().email('email must be a valid email address'),
                yup
                    .string()
                    .matches(/^[0-9]+$/, 'phone must be a number')
                    .min(11, 'phone must be 11 digits')
                    .max(11, 'phone must be 11 digits'),
                yup
                    .string()
                    .min(4, 'username must be at least 4 characters')
                    .max(191, 'username must be at most 191'),
            ])
            .required('email or phone or username is required field '),
    }),
});

export { sendEmailVerificationSchema, forgetPasswordSchema };
