import prisma from '../../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const addUserToDB = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
        data: {
            email:'ibrahim.Eman83@gmail.com',
            phone:'01285043196',
            username:'sara_2121',
            name:'Sara',
            birthdayDate:new Date('10-17-2023').toISOString(),
            password,
            },
        select: {
            id:true,
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
        },
});
};

const addAnotherUserToDB = async () => {
    const password = await bcrypt.hash('12345678Aa@', 8);
    return await prisma.user.create({
        data: {
            email:'iman.al-badwaihi02@eng-st.cu.edu.eg',
            phone:'01567890453',
            username:'iman_elbedwihy',
            name:'Eman',
            birthdayDate:new Date('10-17-2023').toISOString(),
            password,
            },
        select: {
            id:true,
            username: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthdayDate: true,
        },
});
};

const addFollow = async(followerId,followingId) =>{

    await prisma.follow.create({
        data: {
          userID: followerId,
          followingUserID: followingId
        }
      });


};

const deleteUsers= async () => {
    return await prisma.user.deleteMany({});
};

const deleteFollows= async () => {
    return await prisma.follow.deleteMany({});
};


const generateToken = (id) => {
    
    const token = jwt.sign({ id: JSON.stringify(id) }, process.env.JWT_SECRET,{ expiresIn: process.env.EXPIRES_IN});

    return token;
};


module.exports = {
    addUserToDB,addAnotherUserToDB,addFollow,deleteUsers,deleteFollows,generateToken
};