import { CustomConsole } from '@jest/console';
import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';
import { separateMentionsTrends } from '../utils/index.js';
import { catchAsync } from '../utils/index.js';

const deleteinteraction = catchAsync(async (req, res, next) => {
    //check if the interaction exist
    const checkInteractions = await intercationServices.checkInteractions(
        req.params.id
    );
    if (!checkInteractions) {
        return next(new AppError('no interaction by this id', 404));
    }
    //check if the user is the owner of the interaction being deleted
    const checkUserInteractions =
        await intercationServices.checkUserInteractions(
            req.user.id,
            req.params.id
        );
    if (!checkUserInteractions) {
        return next(new AppError('user not authorized', 401));
    }
    const interaction = await intercationServices.deleteinteraction(
        req.params.id
    );

    return res.status(200).send({ data: interaction, status: 'success' });
});
const createReply = catchAsync(async (req, res, next) => {
    const userID = req.user.id;
    const text = req.body.text;

    //check if there is no text or media
    if (!text && (req.files == null || req.files.length <= 0)) {
        return next(new AppError('reply can not be empty', 400));
    }
    //check that parent interaction exist
    const tweeetExist = await intercationServices.checkInteractions(
        req.params.id
    );
    console.log(tweeetExist);
    if (!tweeetExist) {
        return next(new AppError('parent interaction not found', 404));
    }

    const { mentions, trends } = separateMentionsTrends(text);
    //check that all mentions are users
    const filteredMentions = await intercationServices.checkMentions(mentions);

    const reply = await intercationServices.addReply(
        req.files,
        text,
        filteredMentions,
        trends,
        userID,
        req.params.id
    );
    const mentionedUserData = filteredMentions.map((mention) => ({
        id: mention.id,
        username: mention.username,
        name: mention.name,
        email: mention.email,
    }));
    return res.status(201).send({
        data: { reply, mentionedUserData, trends },
        status: 'success',
    });
});

export default { deleteinteraction, createReply };
