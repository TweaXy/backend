import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup); // extend yup

import { isUUID } from '../utils/index.js';

const UUIDField = yup
    .string()
    .required('UUID is required field')
    .test('is-uuid', 'email or phone or username is required field', isUUID);
const emailField = yup.string().email().required('email is required field');

const passwordField = yup
    .string()
    .required('password is required field')
    .min(
        8,
        'password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special'
    )
    .minLowercase(1, 'password must contain at least 1 lower case letter')
    .minUppercase(1, 'password must contain at least 1 upper case letter')
    .minNumbers(1, 'password must contain at least 1 number')
    .minSymbols(1, 'password must contain at least 1 special character');

const phoneField = yup
    .string()
    .length('phone must be 11 numbers')
    .matches(/^[0-9]+$/, 'phone must be all number')
    .required();

export { UUIDField, emailField, passwordField, phoneField };
