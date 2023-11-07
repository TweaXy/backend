import passport from 'passport';
import {OAuth2Strategy} from 'passport-google-oauth';
import userService from '../services/userService.js';
import {generateToken} from '../utils/index.js';

passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  
passport.use(
    new OAuth2Strategy(
      {
        clientID: '11389602792-0pdbqqc7jk04uc2gq72h1tdinl7a37jq.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

const authinticate=passport.authenticate('google',{ session: false },{ scope: ['profile', 'email'] });

const callback=passport.authenticate('google',{ session: false });

const success=async(req, res) => {
 
  const userEmail = req.user.email; 
  const user=await userService.getUserByEmail(userEmail);
  const token = JSON.stringify(generateToken(user.id));
  
  return res.status(200).send({ data: {user,token}, status: 'success' });
};

export default {
    authinticate,
    callback,
    success
};
