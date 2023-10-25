import sharp from 'sharp'
const AddAvatar = async (buffer) => {

    const createdBuffer = await sharp(buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    return createdBuffer;

}

export default AddAvatar;