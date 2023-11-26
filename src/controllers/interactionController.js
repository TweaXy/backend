import AppError from '../errors/appError.js';
import intercationServices from '../services/interactionService.js';

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

export default { deleteinteraction };
