import passport from 'passport';
import {OAuth2Strategy as GoogleStrategy} from 'passport-google-oauth';
import userService from '../services/userService.js';
import {generateToken} from '../utils/index.js';
import AppError from '../errors/appError.js';
import {catchAsync} from '../utils/index.js';


  
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['email'] 
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

const authinticate=passport.authenticate('google',{ session: false },{ scope: ['email'] });

const callback=passport.authenticate('google',{ session: false });

const success=catchAsync(async(req, res,next) => {
 
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
