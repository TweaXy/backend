import jwt from 'jsonwebtoken';

/**
 * Generate token
 * @method
 * @param {User} user - user object
 * @returns {String} - generated token
 */
const generateToken = (id) => {
    
    const token = jwt.sign({ id: JSON.stringify(id) }, process.env.JWT_SECRET,{ expiresIn: process.env.EXPIRES_IN});

    return token;
};

export default generateToken;
