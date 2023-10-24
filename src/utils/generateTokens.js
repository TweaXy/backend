import userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
/**
 * Generate token
 * @method
 * @param {User} user - user object
 * @returns {String} - generated token 
 **/
const GenerateToken = (async (id) => {
    const token = jwt.sign({ id: id.toString() }, process.env.JWT_SECRET);
    await  userService.addToken(id, token);
    return token;
});

export {GenerateToken};