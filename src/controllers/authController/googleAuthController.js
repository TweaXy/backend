import client from '../../config/googleClient.js';
import userService from '../../services/userService.js';
import AppError from '../../errors/appError.js';
import {
    catchAsync,
    addAuthCookie,
    generateToken,
    getProfileInfo,
    getFirebaseProfile,
} from '../../utils/index.js';

const authincateUserByEmail = catchAsync(async (req, res, next) => {
    if (!req.profile) {
        return next(new AppError('invalid token', 401));
    }
    const email = req.profile.email;
    const user = await userService.getUserBasicInfoByUUID(email);
    if (!user) {
        return next(new AppError('no user found ', 404));
    }
    const token = generateToken(user.id);
    addAuthCookie(token, res);
    return res.status(200).send({ data: { user, token }, status: 'success' });
});

const signinWithGoogle = catchAsync(async (req, res, next) => {
    const google_token = req.body.token
        ? req.body.token
        : (await client.getToken(req.body.code)).tokens.id_token;

    const profile = await getProfileInfo(google_token);

    req.profile = profile;

    return authincateUserByEmail(req, res, next);
});

const signinWithGoogleAndroid = catchAsync(async (req, res, next) => {
    const google_token = req.body.token;
    let profile = null;
    try {
        profile = await getFirebaseProfile(google_token);
    } catch (err) {
        console.log(err);
    }
    req.profile = profile;
    return authincateUserByEmail(req, res, next);
});

export { signinWithGoogle, signinWithGoogleAndroid };
