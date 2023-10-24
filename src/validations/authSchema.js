import yup from 'yup';

// Hidden for simplicity

const sendEmailVerificationSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required(),
    }),
});

export { sendEmailVerificationSchema };
