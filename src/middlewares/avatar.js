import multer from 'multer';
const Upload = multer({

    limits: { fileSize: 2000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image'))

        }
        cb(undefined, true)
    }
});
export default Upload