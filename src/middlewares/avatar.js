import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/'
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image'));
        }
        cb(undefined, true);
    },
});
export default upload;
