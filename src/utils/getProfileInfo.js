import client from '../config/googleClient.js';

const getProfileInfo = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return payload;
};

export default getProfileInfo;
