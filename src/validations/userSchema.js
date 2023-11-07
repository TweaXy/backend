import * as  yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

import { emailField,UUIDField } from './fields.js';

const isEmailUniqueSchema = yup.object({
    body: yup.object({
        email: emailField,
    }).required('email is required field'),
});


const isUsernameUniqueSchema = yup.object({
    body: yup.object({
    username: yup.string(),
    }).required('username is required field'),
});
const doesUUIDExitsSchema = yup.object({
    body: yup.object({
        UUID: UUIDField,
    }).required('UUID is required field'),
});


export {
    isEmailUniqueSchema,
    isUsernameUniqueSchema,
    doesUUIDExitsSchema,
};
