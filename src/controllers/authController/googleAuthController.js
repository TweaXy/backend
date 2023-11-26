import { OAuth2Client } from 'google-auth-library';
import userService from '../../services/userService.js';
import AppError from '../../errors/appError.js';
import { catchAsync, addAuthCookie, generateToken } from '../../utils/index.js';



const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

const getProfileInfo = async (token) => {
   
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
   
    const payload = ticket.getPayload();
  
    return payload;
};

const signinWithGoogle = catchAsync(async (req, res, next) => {
  

    const profile = await getProfileInfo(req.body.token);
    const email= profile.email;
    const user = await userService.getUserBasicInfoByUUID(email);
    console.log(user);
    if (!user) {
      return next(new AppError('no user found ', 404));
  }
  const token = generateToken(user.id);
  addAuthCookie(token, res);
  return res.status(200).send({ data: { user, token }, status: 'success' });

      
});

export default signinWithGoogle;


