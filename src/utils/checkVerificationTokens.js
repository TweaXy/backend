import crypto from 'crypto';

export default function checkVerificationTokens(token, encryptedToken) {
    // encrypt token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return hashedToken === encryptedToken;
}
