import passport from 'passport';
import {Strategy as githubStrategy} from 'passport-github2';
import userService from '../services/userService.js';
import {generateToken} from '../utils/index.js';
import AppError from '../errors/appError.js';
import {catchAsync} from '../utils/index.js';


  
passport.use(
    new githubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

const authinticate=passport.authenticate('github',{ session: false },{ scope: ['user:email'] });

const callback=passport.authenticate('github',{ session: false });

const success=catchAsync(async(req, res,next) => {
 
    console.log(req.user.emails);
   if(!req.user.emails)
      return next(new AppError('no user found ', 404));

   const userEmail = req.user.emails[0].value; 
   
   const user=await userService.getUserBasicInfoByUUID(userEmail);
   if(!user){
     return next(new AppError('no user found ', 404));
   }
   const token = JSON.stringify(generateToken(user.id));
  
  return res.status(200).send({ data: {user,token}, status: 'success' });

});

export default {
    authinticate,
    callback,
    success
};
