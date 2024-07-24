import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import path from 'node:path';
import { uploadOnCloudinary } from '../utils/cloudinary';

// ===========================================================================================
//                                   UPLOAD IMAGE
// ===========================================================================================

// This endpoint handles the upload of image files.
// It ensures that the file meets the specified criteria (MIME type and size).
// Images are uploaded to the 'Images' folder on Cloudinary with a size limit of 5 MB.
// If no file is uploaded or the uploaded file is not an image, a BadRequestError is thrown.
// The response includes details of the successfully uploaded image.
/**
 * @description Upload an image file
 * @route POST /api/v1/uploadImage
 * @access Private/Admin
 */
// ===========================================================================================
export const uploadImage = async (req: Request, res: Response) => {
  // Check if a file is uploaded
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'No file uploaded' });
  }

  // Construct the local file path
  const localFilePath = path.join(
    __dirname,
    '../../public/uploads',
    req.file.filename
  );

  // Upload the file to Cloudinary
  const cloudinaryResult = await uploadOnCloudinary(localFilePath, 'Images');

  // Send success response with the Cloudinary result
  return res.status(StatusCodes.OK).json({
    message: 'File uploaded successfully',
    file: cloudinaryResult,
  });
};

// ===========================================================================================
//                                   UPLOAD PDF
// ===========================================================================================

// This endpoint handles the upload of PDF files.
// It ensures that the file meets the specified criteria (MIME type and size).
// PDFs are uploaded to the 'PDFs' folder on Cloudinary with a size limit of 30 MB.
// If no file is uploaded or the uploaded file is not a PDF, a BadRequestError is thrown.
// The response includes details of the successfully uploaded PDF.
/**
 * @description Upload a PDF file
 * @route POST /api/v1/uploadPdf
 * @access Private/Admin
 */
// ===========================================================================================
export const uploadPdf = async (req: Request, res: Response) => {
   // Check if a file is uploaded
   if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'No file uploaded' });
  }

  // Check if the uploaded file is a PDF
  if (req.file.mimetype !== 'application/pdf') {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Uploaded file is not a PDF' });
  }

  // Construct the local file path
  const localFilePath = path.join(
    __dirname,
    '../../public/uploads',
    req.file.filename
  );

  // Upload the file to Cloudinary
  const cloudinaryResult = await uploadOnCloudinary(localFilePath, 'PDFs');

  // Optionally, remove the local file after successful upload
  // fs.unlinkSync(localFilePath);

  // Send success response with the Cloudinary result
  return res.status(StatusCodes.OK).json({
    message: 'PDF uploaded successfully',
    file: cloudinaryResult,
  });
};

// ===========================================================================================
//                                   UPLOAD FILES
// ===========================================================================================

// This endpoint handles the upload of both image and PDF files.
// It ensures that files meet the specified criteria (MIME type and size).
// Images are uploaded to the 'Images' folder on Cloudinary with a size limit of 5 MB.
// PDFs are uploaded to the 'PDFs' folder on Cloudinary with a size limit of 30 MB.
// If no files are uploaded, a BadRequestError is thrown.
// The response includes details of successfully uploaded files.
/**
 * @description Upload image and PDF files
 * @route POST /api/v1/uploadMultipleFiles
 * @access Private/Admin
 */
// ===========================================================================================
export const uploadFiles = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Check if files exist
  if (!files || (!files.image && !files.pdf)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No files uploaded' });
  }

  const uploadedFiles: unknown[] = [];

  // Process image file
  if (files.image && files.image.length > 0) {
    const imageFile = files.image[0];
    const localImagePath = path.join(__dirname, '../../public/uploads', imageFile.filename);
    const cloudinaryImageResult = await uploadOnCloudinary(localImagePath, 'Images');
    uploadedFiles.push({ type: 'image', file: cloudinaryImageResult });
  }

  // Process PDF file
  if (files.pdf && files.pdf.length > 0) {
    const pdfFile = files.pdf[0];
    const localPdfPath = path.join(__dirname, '../../public/uploads', pdfFile.filename);
    const cloudinaryPdfResult = await uploadOnCloudinary(localPdfPath, 'PDFs');
    uploadedFiles.push({ type: 'pdf', file: cloudinaryPdfResult });
  }

  return res.status(StatusCodes.OK).json({
    message: 'Files uploaded successfully',
    files: uploadedFiles,
  });
};
