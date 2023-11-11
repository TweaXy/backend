import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import userService from '../services/userService.js';
import {generateToken} from '../utils/index.js';
import AppError from '../errors/appError.js';
import {catchAsync} from '../utils/index.js';


  
passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['emails']
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        return done(null, profile);
      }
    )
  );

const authinticate=passport.authenticate('facebook',{ session: false },{ scope : ['email'] });

const callback=passport.authenticate('facebook',{ session: false });

const success=catchAsync(async(req, res,next) => {

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
