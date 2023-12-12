import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/tweetsMedia/',
    filename: (req, file, cb) => {
        // Generate a unique filename based on username and date
        const uniqueFilename = Date.now() + file.originalname;
        cb(null, uniqueFilename);
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // size is 10mb
    fileFilter(req, file, cb) {
        if (
            !file.originalname
                .toLowerCase()
                .match(/\.(jpg|jpeg|png|mp4|mkv|mov)$/)
        ) {
            return cb(new Error('please upload an image or video'));
        }
        cb(undefined, true);
    },
});

export default upload;
