import sharp from 'sharp';
import fs from 'fs';

const addAvatar = async (buffer) => {
    let createdBuffer;
    if (buffer)
        createdBuffer = await sharp(buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
    else {
        const defaultBuffer = await fs.promises.readFile(
            'src/utils/default.png'
        );
        createdBuffer = await sharp(defaultBuffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
    }

    return createdBuffer;
};

export default addAvatar;
