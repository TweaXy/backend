import admin from 'firebase-admin';

const getFirebaseProfile = async (google_token) => {
    return await admin.auth().verifyIdToken(google_token);
};
export default getFirebaseProfile;
