import multer from "multer";
import fs from "fs";
import path from "path";

// Configure multer storage and file name
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "uploads/");
  // },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// // Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  console.log(req.files, req.file);
  upload.array("image", 3)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    console.log(req.files);

    if (typeof req.files !== "undefined") {
      // Retrieve uploaded files
      const files = req.files;

      const errors = [];

      // Validate file types and sizes
      files.forEach((file) => {
        const allowedTypes = ["image/jpeg", "image/png"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.mimetype)) {
          errors.push(`Invalid file type: ${file.originalname}`);
        }

        if (file.size > maxSize) {
          errors.push(`File too large: ${file.originalname}`);
        }
      });

      // Handle validation errors
      if (errors.length > 0) {
        // Remove uploaded files
        // files.forEach((file) => {
        //   fs.unlinkSync(file.path);
        // });

        return res.status(400).json({ errors });
      }

      // Attach files to the request object
      req.files = files;
    }
    // Proceed to the next middleware or route handler
    next();
  });
};
// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb("Please upload only images.", false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// const uploadFiles = upload.array("image", 10); // limit to 10 images

// const uploadMiddleware = (req, res, next) => {
//   uploadFiles(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       if (err.code === "LIMIT_UNEXPECTED_FILE") {
//         // Too many images exceeding the allowed limit
//         // ...
//       }
//     } else if (err) {
//       // handle other errors
//     }

//     // Everything is ok.
//     next();
//   });
// };
// upload.array('image', 5), (req, res, next) => {
//   const uploadedFiles = req.files.map((file) => file.filename);
// // mapping through all of the files and setting file name for every files
//   res.json({ files: uploadedFiles });
//   console.log('file uploaded');
//   next()
// }
export default uploadMiddleware;
