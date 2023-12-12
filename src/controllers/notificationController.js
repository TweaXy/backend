import AppError from '../errors/appError.js';
import admin from 'firebase-admin';
import { catchAsync } from '../../utils/index.js';
import {
    addFollowNotificationDB,
    getFirebaseToken,
    addLikeNotificationDB,
} from '../services/nofiticationService.js';

const addFollowNotification = catchAsync(async (req, res, next) => {
    if (!req.user || !req.follwedUser) {
        return next(new AppError('no user found', 404));
    }
    await addFollowNotificationDB(req.user, req.follwedUser);
    const tokens = await getFirebaseToken(req.follwedUser.id);

    try {
        await admin.messaging().send({
            token: tokens.data.firebaseToken,
            webpush: {
                notification: {
                    title: `${req.user.username} followed you`,
                    body: `${req.user.username} followed you`,
                },
            },
        });
    } catch (err) {
        console.error(err);
    }
});

const addLikeNotification = catchAsync(async (req, res, next) => {
    if (!req.user || !req.interaction) {
        return next(new AppError('no user found', 404));
    }
    await addLikeNotificationDB(req.user, req.interaction.user);
    const tokens = await getFirebaseToken(req.follwedUser.id);
    const truncatedText = !req.interaction.text
        ? ''
        : req.interaction.text.substring(0, 100);
    try {
        await admin.messaging().send({
            token: tokens.data.firebaseToken,
            webpush: {
                notification: {
                    title: `${req.user.username}  liked your ${req.interaction.type}`,
                    body: `${req.user.username} liked ${truncatedText}`,
                },
            },
        });
    } catch (err) {
        console.error(err);
    }
});
export default {
    addFollowNotification,
    addLikeNotification,
};
