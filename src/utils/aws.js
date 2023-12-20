import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';
// import mime from 'mime-types';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

// uploads a file to s3

async function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    let fileKey = file.filename;
    if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        fileKey += '.png';
    }

    if (file.originalname.match(/\.(mp4|mkv|mov)$/)) {
        fileKey += '.mp4';
    }
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: fileKey,
    };
    const img = await s3.upload(uploadParams).promise();
    return img.key;
}

async function uploadMultipleFile(fileArray) {
    const keys = [];
    await Promise.all(
        fileArray.map(async (file) => {
            let fileKey = file.filename;
            if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                fileKey += '.png';
            }

            if (file.originalname.match(/\.(mp4|mkv|mov)$/)) {
                fileKey += '.mp4';
            }
            // Configuring parameters for S3 Object
            keys.push(fileKey);
            const S3params = {
                Bucket: bucketName,
                Body: fs.createReadStream(file.path),
                Key: fileKey,
            };
            await s3.upload(S3params).promise();
        })
    );
    return keys;
}

// downloads a files from s3
async function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    try {
        await s3.headObject(downloadParams).promise();
        const img = await s3.getObject(downloadParams).createReadStream();
        return { undefined, img };
    } catch (error) {
        return { error, undefined };
    }
}

// Function to delete a file from S3
async function deleteFile(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName,
    };

    return await s3.deleteObject(deleteParams).promise();
}

// Function to delete a file from S3
async function deleteMultipleFile(fileArray) {
    await Promise.all(
        fileArray.map(async (file) => {
            // Configuring parameters for S3 Object
            const S3params = {
                Bucket: bucketName,
                Key: file.fileName,
            };
            await s3.deleteObject(S3params).promise();
        })
    );
}

export {
    uploadFile,
    deleteFile,
    getFileStream,
    uploadMultipleFile,
    deleteMultipleFile,
};
