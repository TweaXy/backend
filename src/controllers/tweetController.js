import AppError from '../errors/appError.js';
import { catchAsync } from '../utils/index.js';
import intercationServices from '../services/interactionService.js';

const createTweet = catchAsync(async (req, res, next) => {

  const userID=req.user.id;
  const text=req.body.text;
    //check if there is no text or media
    if(!text && req.files.length <= 0)
    {   
       return next(new AppError('tweet can not be empty', 400));
    }
  const tweet=await intercationServices.addTweet(req.files,text,userID);
   

      return res.status(200).send({data:tweet, status: 'success' });
});

export { createTweet };
