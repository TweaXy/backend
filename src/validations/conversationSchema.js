import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup); // extend yup
import { UUIDField } from './fields.js';
const addConversationSchema = yup.object({
    body: yup.object({
        UUID: UUIDField,
    }),
});

const addMessageSchema = yup.object({
    body: yup.object({
        text: yup.string().max(9000),
    }),
});

export { addConversationSchema, addMessageSchema };
