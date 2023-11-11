import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup); // extend yup

import { isUUID } from '../utils/index.js';

const UUIDField = yup
    .string()
    .test('is-uuid', 'email or phone or username is required field', isUUID)
    .required('UUID is required field');

const emailField = yup
    .string()
    .email('must have email format')
    .required('email is required field');

const passwordField = yup
    .string()
    .min(
        8,
        'password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special'
    )
    .minLowercase(1, 'password must contain at least 1 lower case letter')
    .minUppercase(1, 'password must contain at least 1 upper case letter')
    .minNumbers(1, 'password must contain at least 1 number')
    .minSymbols(1, 'password must contain at least 1 special character')
    .required('password is required field');

const phoneField = yup
    .string()
    .length('phone must be 11 numbers')
    .matches(/^[0-9]+$/, 'phone must be all number')
    .required('phone is required field');

const usernameField = yup
    .string()
    .min(4, 'username must be at least 4 characters')
    .max(191, 'username must be at most 191 characters')
    .required('username is required field');

const randomBytesTokenField = (name) =>
    yup
        .string()
        .length(8, `${name} must be 8 characters`)
        .required(`${name} is required field`);

export {
    UUIDField,
    emailField,
    passwordField,
    phoneField,
    usernameField,
    randomBytesTokenField,
};
