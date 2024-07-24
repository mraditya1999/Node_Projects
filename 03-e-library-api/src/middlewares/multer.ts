import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../../public/uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

interface IFieldConfig {
  name: string;
  maxCount: number;
}

export const multiFileUpload = (fields: IFieldConfig[]) =>
  multer({ storage }).fields(fields);

export const singleFileUpload = (fieldName: string) =>
  multer({ storage }).single(fieldName);
