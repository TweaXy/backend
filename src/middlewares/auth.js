import  jwt  from 'jsonwebtoken';
import prisma from '../prisma.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../errors/appError.js';

const auth =catchAsync (async (req, res, next) => {
    
        const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
        const user = await prisma.User.findUnique({
            where: {
                id: decode.id,
            },
        });
        
        
    if (!user)
        return next(new AppError('please authenticate', 404));
        req.user = user;
        next();
    } );


export default auth;