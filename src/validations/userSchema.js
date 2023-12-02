import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup

import {
    emailField,
    UUIDField,
    usernameField,
    passwordField,
    randomBytesTokenField,
} from './fields.js';

const isEmailUniqueSchema = yup.object({
    body: yup.object({
        email: emailField,
    }),
});

const isUsernameUniqueSchema = yup.object({
    body: yup
        .object({
            username: usernameField,
        })
        .noUnknown()
        .strict(),
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

const userProfileSchema = yup.object({
    body: yup.object({
        name: yup
            .string()
            .min(3, 'name must be at least 3 characters')
            .max(50, 'name must be at most 50 characters'),
        phone: yup
            .string()
            .length(11, 'phone must be 11 numbers')
            .matches(/^[0-9]+$/, 'phone must be all number'),
        bio: yup.string().max(150, 'bio must be at most 150 characters'),
        birthdayDate: yup
            .date('birthdayDate must be in date format')
            .max(new Date(), 'birthdayDate must be in the past'),
        avatar: yup.string(),
        cover: yup.string(),
        location: yup
            .string()
            .max(30, 'location must be at most 30 characters'),
        website: yup
            .string()
            .max(100, 'website must be at most 100 characters')
            .matches(
                /^$|(?:(?:http(?:s)?|ftp):\/\/)(?:\S+(?::(?:\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\d){2,5})?(?:\/(?:\S)*)?$/,
                'invalid website'
            ),
    }),
});

const checkPasswordSchema = yup.object({
    body: yup.object({
        confirmPassword: passwordField.required(),
        newPassword: passwordField.required(),
    }),
});

const checkEmailVerificationToUpdateEmailSchema = yup.object({
    body: yup.object({
        email: emailField.required('email field is required'),
        token: randomBytesTokenField('email verification code'),
    }),
});

export {
    isEmailUniqueSchema,
    isUsernameUniqueSchema,
    doesUUIDExitsSchema,
    userIDSchema,
    userProfileSchema,
    checkPasswordSchema,
    checkEmailVerificationToUpdateEmailSchema,
};
