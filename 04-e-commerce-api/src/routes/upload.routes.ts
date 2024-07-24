import express from 'express';
import {
  uploadFiles,
  uploadImage,
  uploadPdf,
} from '../controllers/upload.controller';
import {
  authenticateUser,
  authorizePermissions,
  uploadMultipleFile,
  uploadSingleFile,
  validateImageAndPdfFiles,
  validatePdfFile,
} from '../middlewares';
import { validateImageFile } from '../middlewares';
const router = express.Router();

router
  .route('/uploadImage')
  .post(
    [
      authenticateUser,
      authorizePermissions('admin'),
      uploadSingleFile('image'),
      validateImageFile,
    ],
    uploadImage
  );

router
  .route('/uploadPdf')
  .post(
    [
      authenticateUser,
      authorizePermissions('admin'),
      uploadSingleFile('pdf'),
      validatePdfFile,
    ],
    uploadPdf
  );

router.route('/uploadImageAndPdf').post(
  [
    authenticateUser,
    authorizePermissions('admin'),
    uploadMultipleFile([
      { maxCount: 1, name: 'image' },
      { maxCount: 1, name: 'pdf' },
    ]),
    validateImageAndPdfFiles,
  ],
  uploadFiles
);
export default router;
