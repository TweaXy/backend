import {
    addTokenToBlacklist,
    removeDeviceToken,
} from '../../services/authService.js';
import { catchAsync } from '../../utils/index.js';

const logout = catchAsync(async (req, res, next) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000), //very short time 1 sec
        httpOnly: true, //cookie cannot be accessed by client side js
    });

    const token = req.header('Authorization').replace('Bearer ', '');
    if (token) await addTokenToBlacklist(token);

    if ('token' in req.body && 'type' in req.body) {
        await removeDeviceToken(req.body.token, req.body.type);
    }
    return res.status(200).send({ status: 'success' });
});
export default logout;
