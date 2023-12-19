import AppError from '../errors/appError.js';
import { removeDeviceToken } from '../services/authService.js';
import nofiticationService from '../services/nofiticationService.js';
import { sendNotification, catchAsync, pagination } from '../utils/index.js';
const addFollowNotification = catchAsync(async (req, res, next) => {
    if (req.user.id == req.follwedUser.id) return res;

    await nofiticationService.addFollowNotificationDB(
        req.user.id,
        req.follwedUser.id
    );
    const androidTokens = await nofiticationService.getFirebaseToken(
        [req.follwedUser.id],
        'A'
    );
    const webTokens = await nofiticationService.getFirebaseToken(
        [req.follwedUser.id],
        'W'
    );
    sendNotification(
        androidTokens,
        webTokens,
        'FOLLOW',
        req.user.username,
        null
    );
    return res;
});

const addLikeNotification = catchAsync(async (req, res, next) => {
    if (req.user.id == req.interaction.user.id) return res;

    await nofiticationService.addLikeNotificationDB(
        req.user.id,
        req.interaction
    );
    const androidTokens = await nofiticationService.getFirebaseToken(
        [req.interaction.user.id],
        'A'
    );
    const webTokens = await nofiticationService.getFirebaseToken(
        [req.interaction.user.id],
        'W'
    );
    sendNotification(
        androidTokens,
        webTokens,
        'LIKE',
        req.user.username,
        req.interaction
    );
    return res;
});

const addAndoridToken = catchAsync(async (req, res, next) => {
    if ((await nofiticationService.checkTokens(req.body.token, 'A')) != null) {
        return next(new AppError('this token already exists', 400));
    }
    await nofiticationService.addToken(req.user.id, req.body.token, 'A');
    res.status(201).send({
        status: 'success',
        data: null,
    });
});

const addWebToken = catchAsync(async (req, res, next) => {
    if ((await nofiticationService.checkTokens(req.body.token, 'W')) != null) {
        return next(new AppError('this token already exists', 400));
    }
    await nofiticationService.addToken(req.user.id, req.body.token, 'W');
    res.status(201).send({
        status: 'success',
        data: null,
    });
});

const addReplyNotification = catchAsync(async (req, res, next) => {
    if (req.user.id != req.parentinteraction.user.id) {
        await nofiticationService.addReplyNotificationDB(
            req.user.id,
            req.interaction,
            req.parentinteraction.user.id
        );
        const androidTokens = await nofiticationService.getFirebaseToken(
            [req.parentinteraction.user.id],
            'A'
        );
        const webTokens = await nofiticationService.getFirebaseToken(
            [req.parentinteraction.user.id],
            'W'
        );
        sendNotification(
            androidTokens,
            webTokens,
            'REPLY',
            req.user.username,
            req.parentinteraction
        );
    }
    next();
});

const getNotification = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const schema = {
        where: {
            userID: userId,
            OR: [{ interaction: null }, { interaction: { deletedDate: null } }],
        },
        orderBy: {
            createdDate: 'desc', // 'desc' for descending order, 'asc' for ascending order
        },
        select: {
            id: true,
            createdDate: true,
            action: true,
            interaction: {
                select: {
                    id: true,
                    type: true,
                    text: true,
                    createdDate: true,
                    parentInteractionID: true,
                    userID: true,
                    parentInteraction: true,
                },
            },
            fromUser: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    followedBy: {
                        select: {
                            userID: true,
                        },
                        where: {
                            userID: req.user.id,
                        },
                    },
                    following: {
                        select: {
                            followingUserID: true,
                        },
                        where: {
                            followingUserID: req.user.id,
                        },
                    },
                },
            },
        },
    };
    const paginationData = await pagination(req, 'notifications', schema);

    const items = paginationData.data.items;
    await nofiticationService.updateSeen(req.user.id);

    items.map((item) => {
        item.fromUser.followedByMe = item.fromUser.followedBy.length > 0;
        item.fromUser.followsMe = item.fromUser.following.length > 0;
        delete item.fromUser.followedBy;
        delete item.fromUser.following;
        delete item.id;
        if (item.action != 'FOLLOW')
            if (item.action == 'REPLY') {
                item.reply = item.interaction;

                item.interaction = item.interaction.parentInteraction;
                delete item.reply.parentInteraction;
            } else delete item.interaction.parentInteraction;
        return item;
    });
    let notificationCount = 0;
    const notifications = [];
    for (const item of items) {
        if (
            notificationCount > 0 &&
            notifications[notificationCount - 1].action == item.action &&
            item.action == 'FOLLOW'
        ) {
            notifications[notificationCount - 1].text = `${
                notifications[notificationCount - 1].fromUser.username
            } and others have followed you`;
        } else if (
            notificationCount > 0 &&
            notifications[notificationCount - 1].action == item.action &&
            item.action == 'LIKE' &&
            item.interaction.id ==
                notifications[notificationCount - 1].interaction.id
        ) {
            notifications[notificationCount - 1].text = `${
                notifications[notificationCount - 1].fromUser.username
            } and others have Liked your ${item.interaction.type}`;
        } else if (
            notificationCount > 0 &&
            notifications[notificationCount - 1].action == item.action &&
            item.action == 'RETWEET' &&
            item.interaction.id ==
                notifications[notificationCount - 1].interaction.id
        )
            notifications[notificationCount - 1].text = `${
                notifications[notificationCount - 1].fromUser.username
            } and others reposted your ${item.interaction.type}`;
        else if (
            notificationCount > 0 &&
            notifications[notificationCount - 1].action == item.action &&
            item.action == 'REPLY' &&
            item.interaction.id ==
                notifications[notificationCount - 1].interaction.id
        ) {
            notifications[notificationCount - 1].text = `${
                notifications[notificationCount - 1].fromUser.username
            } and others have replied to your ${item.interaction.type}`;
        } else {
            notifications.push(item);
            if (item.action == 'MENTION')
                notifications[
                    notificationCount
                ].text = `${item.fromUser.username} has mentioned you in a ${item.interaction.type}`;
            else if (item.action == 'LIKE')
                notifications[
                    notificationCount
                ].text = `${item.fromUser.username} has Liked your ${item.interaction.type}`;
            else if (item.action == 'REPLY')
                notifications[
                    notificationCount
                ].text = `${item.fromUser.username} has replied to your ${item.interaction.type}`;
            else if (item.action == 'FOLLOW')
                notifications[
                    notificationCount
                ].text = `${item.fromUser.username} has followed you`;
            else if (item.action == 'RETWEET')
                notifications[
                    notificationCount
                ].text = `${item.fromUser.username} reposted your ${item.interaction.type}`;
            notificationCount++;
        }
    }
    const paginationDetails = {
        itemsNumber: paginationData.pagination.itemsCount,
        nextPage: paginationData.pagination.nextPage,
        prevPage: paginationData.pagination.prevPage,
    };

    return res.status(200).send({
        data: { notifications },
        pagination: paginationDetails,
        status: 'success',
    });
});

const addMentionNotification = catchAsync(async (req, res, next) => {
    const mentions = req.mentions;
    const mentionIds = mentions.map((mention) => {
        if (mention.id != req.user.id) return mention.id;
    });
    if (mentionIds.length > 0) {
        await nofiticationService.addMentionNotificationDB(
            req.user.id,
            req.interaction,
            mentionIds
        );
        const androidTokens = await nofiticationService.getFirebaseToken(
            mentionIds,
            'A'
        );
        const webTokens = await nofiticationService.getFirebaseToken(
            mentionIds,
            'W'
        );
        sendNotification(
            androidTokens,
            webTokens,
            'MENTION',
            req.user.username,
            req.interaction
        );
        return res;
    } else return res;
});

const getNotificationCount = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const schema = {
        where: {
            userID: userId,
            OR: [{ interaction: null }, { interaction: { deletedDate: null } }],
            seen: false,
        },
        orderBy: {
            createdDate: 'desc', // 'desc' for descending order, 'asc' for ascending order
        },
        select: {
            id: true,
            createdDate: true,
            action: true,
            interaction: {
                select: {
                    id: true,
                    type: true,
                    text: true,
                    createdDate: true,
                    parentInteractionID: true,
                    userID: true,
                    parentInteraction: true,
                },
            },
            fromUser: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    followedBy: {
                        select: {
                            userID: true,
                        },
                        where: {
                            userID: req.user.id,
                        },
                    },
                    following: {
                        select: {
                            followingUserID: true,
                        },
                        where: {
                            followingUserID: req.user.id,
                        },
                    },
                },
            },
        },
    };
    const items = await nofiticationService.getUnseenNotificationsCount(schema);

    let notificationCount = 0;
    const notifications = [];
    for (const item of items) {
        if (
            !(
                (notificationCount > 0 &&
                    notifications[notificationCount - 1].action ==
                        item.action &&
                    item.action == 'FOLLOW') ||
                (notificationCount > 0 &&
                    notifications[notificationCount - 1].action ==
                        item.action &&
                    item.action == 'LIKE' &&
                    item.interaction.id ==
                        notifications[notificationCount - 1].interaction.id) ||
                (notificationCount > 0 &&
                    notifications[notificationCount - 1].action ==
                        item.action &&
                    item.action == 'RETWEET' &&
                    item.interaction.id ==
                        notifications[notificationCount - 1].interaction.id) ||
                (notificationCount > 0 &&
                    notifications[notificationCount - 1].action ==
                        item.action &&
                    item.action == 'REPLY' &&
                    item.interaction.id ==
                        notifications[notificationCount - 1].interaction.id)
            )
        ) {
            notifications.push(item);

            notificationCount++;
        }
    }

    return res.status(200).send({
        data: { notificationCount },
        status: 'success',
    });
});
const addRetweetNotification = catchAsync(async (req, res, next) => {
    if (req.user.id == req.interaction.user.id) return res;
    await nofiticationService.addRetweetNotificationDB(
        req.user.id,
        req.interaction
    );
    const androidTokens = await nofiticationService.getFirebaseToken(
        [req.interaction.user.id],
        'A'
    );
    const webTokens = await nofiticationService.getFirebaseToken(
        [req.interaction.user.id],
        'W'
    );
    sendNotification(
        androidTokens,
        webTokens,
        'RETWEET',
        req.user.username,
        req.interaction
    );
    return res;
});
const deleteAndoridToken = catchAsync(async (req, res, next) => {
    await removeDeviceToken(req.body.token, 'android');
    return res.status(200).send({
        data: null,
        status: 'success',
    });
});

const deleteWebToken = catchAsync(async (req, res, next) => {
    await removeDeviceToken(req.body.token, 'web');
    return res.status(200).send({
        data: null,
        status: 'success',
    });
});

const checkStatus = catchAsync(async (req, res, next) => {
    const status = await nofiticationService.checkStatus(
        req.body.token,
        req.body.type
    );
    return res.status(200).send({
        data: { status: status ? 'enabled' : 'disabled' },
        status: 'success',
    });
});
export default {
    addFollowNotification,
    addLikeNotification,
    addAndoridToken,
    addWebToken,
    addReplyNotification,
    getNotification,
    addMentionNotification,
    getNotificationCount,
    addRetweetNotification,
    deleteAndoridToken,
    checkStatus,
    deleteWebToken,
};
