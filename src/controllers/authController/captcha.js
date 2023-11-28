import AppError from '../../errors/appError.js';

import { catchAsync } from '../../utils/index.js';
import fetch from 'node-fetch';
import { stringify } from 'querystring';

const captcha = catchAsync(async (req, res, next) => {
    if (!req.body.captcha)
        return next(new AppError('Please select captcha', 401));

    // Secret key
    const secretKey = process.env.SECRET_KEY_CAPTCHA;

    // Verify URL
    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress,
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    // Make a request to verifyURL
    const body = await fetch(verifyURL).then((res) => res.json());

    // If not successful
    if (body.success !== undefined && !body.success)
        return next(new AppError('Failed captcha verification', 401));

    // If successful
    return res.status(200).json({
        status: 'success',
    });
});

export default captcha;
