import  jwt  from 'jsonwebtoken';
import prisma from '../prisma.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/appError.js';

const auth =catchAsync (async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
        where: {
            id: JSON.parse(decode.id),
        },
    });
    let isBlocked=null;
  
     isBlocked = await prisma.blockedTokens.findUnique({
        where: {
            token,
        },
    });
    // token provided?
    if (token == null) {
        return next(new AppError('no token provided', 401));
    }
    if (isBlocked) {
        return next(new AppError('token not valid', 401));
    }
        
        
    if (!user)
        return next(new AppError('please authenticate', 401));
        req.user = user;
        next();
    } );
   
    
    
        
        


export default auth;