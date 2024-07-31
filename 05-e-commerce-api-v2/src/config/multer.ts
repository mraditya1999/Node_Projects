import multer from 'multer';
import path from 'node:path';

// ===========================================================================================
//                                   FILE UPLOAD CONFIGURATION
// ===========================================================================================

// Define the path for uploading images
const imageUploadPath = path.resolve(__dirname, '../../public/uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
