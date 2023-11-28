import AppError from '../errors/appError.js';
import { catchAsync } from '../utils/index.js';
import intercationServices from '../services/interactionService.js';
import { separateMentionsTrends } from '../utils/index.js';
const createTweet = catchAsync(async (req, res, next) => {
    const userID = req.user.id;
    const text = req.body.text;

    //check if there is no text or media
    if (!text && (req.files == null || req.files.length <= 0)) {
        return next(new AppError('tweet can not be empty', 400));
    }
    const { mentions, trends } = separateMentionsTrends(text);
    //check that all mentions are users
    const filteredMentions = await intercationServices.checkMentions(mentions);

    const tweet = await intercationServices.addTweet(
        req.files,
        text,
        filteredMentions,
        trends,
        userID
    );
    const mentionedUserData = filteredMentions.map((mention) => ({
        id: mention.id,
        username: mention.username,
        name: mention.name,
        email: mention.email,
    }));
    return res.status(201).send({
        data: { tweet, mentionedUserData, trends },
        status: 'success',
    });
});

export { createTweet };
