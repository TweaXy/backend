import multer from 'multer';
import AppError from '../errors/appError.js';
const storage = multer.diskStorage({
    destination: 'uploads/',
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new AppError('please upload an image', 403));
        }
        cb(undefined, true);
    },
});
export default upload;
