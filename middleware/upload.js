import multer from "multer";
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;
