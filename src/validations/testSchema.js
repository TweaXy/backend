import yup from 'yup';

// Hidden for simplicity

const testSchema = yup.object({
    body: yup.object({
        url: yup.string().url().required(),
        title: yup
            .string()
            .min(8, 'title must be larger than 8 characters')
            .max(32)
            .required(),
        content: yup.string().min(8).max(255).required(),
        contact: yup.string().email().required(),
    }),
    params: yup.object({
        id: yup.number(),
    }),
});




export default testSchema;
