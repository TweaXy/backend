import crypto from 'crypto';

export default function createRandomByteToken(byteLength = 32) {
    const token = crypto.randomBytes(byteLength).toString('hex');
    // encrypt token
    const encryptedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    return { token, encryptedToken };
}
