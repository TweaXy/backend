import  jwt  from 'jsonwebtoken';
import prisma from '../prisma.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/appError.js';

const auth =catchAsync (async (req, res, next) => {
    
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const userToken = await prisma.Tokens.findUnique({
            where: {
                userID: decode._id,
                token,
            },
        });
        
        
    if (!userToken)
        return next(new AppError('please authenticate', 404));
        
        req.userToken = userToken;
        next();
    } );


export default auth;