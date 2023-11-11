import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

import {
    emailField,
    passwordField,
    UUIDField,
    usernameField,
    randomBytesTokenField,
} from './fields.js';

const signupSchema = yup.object({
    body: yup.object({
        email: emailField,
        emailVerificationToken: randomBytesTokenField(
            'email verification code'
        ),
        username: usernameField,
        name: yup
            .string()
            .min(3, 'name must be at least 3 characters')
            .max(50, 'name must be at most 50 characters')
            .required('name is required field'),
        birthdayDate: yup
            .date('birthdayDate must be in date format')
            .max(new Date(), 'birthdayDate must be in the past')
            .required('birthdayDate is required fieild'),
        password: passwordField,
    }),
});

const sendEmailVerificationSchema = yup.object({
    body: yup.object({
        email: emailField,
    }),
});

const checkEmailVerificationSchema = yup.object({
    params: yup.object({
        email: emailField,
        token: randomBytesTokenField('email verification code'),
    }),
});

const forgetPasswordSchema = yup.object({
    body: yup.object({
        UUID: UUIDField,
    }),
});

const resetPasswordSchema = yup.object({
    body: yup.object({
        password: passwordField,
    }),
    params: yup.object({
        UUID: UUIDField,
        token: randomBytesTokenField('reset password code'),
    }),
});

const loginSchema = yup.object({
    body: yup.object({
        UUID: UUIDField,
        password: passwordField,
    }),
});

export {
    sendEmailVerificationSchema,
    checkEmailVerificationSchema,
    forgetPasswordSchema,
    loginSchema,
    resetPasswordSchema,
    signupSchema,
};
