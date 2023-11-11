import * as  yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

import { emailField, UUIDField, usernameField } from './fields.js';

const isEmailUniqueSchema = yup.object({
    body: yup.object({
        email: emailField,
    }),
});

const isUsernameUniqueSchema = yup.object({
    body: yup.object({
        username: usernameField,
    }),
});
const doesUUIDExitsSchema = yup.object({
    body: yup.object({
        UUID: UUIDField,
    }),
});

const userIDSchema = yup.object({
    params: yup.object({
        id: yup.string().required('id is required field'),
    }),
});

export {
    isEmailUniqueSchema,
    isUsernameUniqueSchema,
    doesUUIDExitsSchema,
    userIDSchema,
};
