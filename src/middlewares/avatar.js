import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: (req, file, cb) => {
      // Generate a unique filename based on username and date
      const uniqueFilename = req.body.username + '-' + Date.now() + '-' + file.originalname;
      cb(null, uniqueFilename);
    },
  });
const upload = multer({

    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image'));

        }
        cb(undefined, true);
    }
});
export default upload;