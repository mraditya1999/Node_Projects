import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../errors';

// ===========================================================================================
//                                   FILE SIZE LIMITS
// ===========================================================================================

// Maximum allowed file sizes for images and PDFs on Cloudinary
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 30 * 1024 * 1024; // 30 MB

// ===========================================================================================
//                                   IMAGE FILE VALIDATION
// ===========================================================================================
// Custom middleware to check if file is an image and its size
export const validateImageFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  if (!file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'No Image uploaded' });
  }

  if (!file.mimetype.startsWith('image')) {
    return next(new CustomError.BadRequestError('Please upload an image'));
  }

  if (file.size > MAX_IMAGE_SIZE) {
    // 5 MB in bytes (size limit of image on cloudinary)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Image size should be under 5 MB' });
  }

  next();
};

// ===========================================================================================
//                                   PDF FILE VALIDATION
// ===========================================================================================
// Custom middleware to validate uploaded PDF files
export const validatePdfFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = req.file;
  if (!file) {
    return next(new CustomError.BadRequestError('No Pdf uploaded'));
  }

  if (file.mimetype !== 'application/pdf') {
    return next(
      new CustomError.BadRequestError('Please upload file in PDF format')
    );
  }

  if (file.size > MAX_PDF_SIZE) {
    return next(
      new CustomError.BadRequestError(
        'Pdf size is too large, upload less than 30 MB'
      )
    );
  }

  next();
};

// ===========================================================================================
//                                   IMAGE AND PDF FILE VALIDATION
// ===========================================================================================
// Custom middleware to validate both image and PDF files
export const validateImageAndPdfFiles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files || (!files.image && !files.pdf)) {
    return next(new CustomError.BadRequestError('No files uploaded'));
  }

  if (!files.image || !files.pdf) {
    return next(
      new CustomError.BadRequestError('Please upload image and pdf both')
    );
  }

  const imageFiles = files['image'];
  const pdfFiles = files['pdf'];

  if (!imageFiles || imageFiles.length === 0) {
    return next(new CustomError.BadRequestError('Image file is required'));
  }

  if (!pdfFiles || pdfFiles.length === 0) {
    return next(new CustomError.BadRequestError('PDF file is required'));
  }

  const imageFile = imageFiles[0];
  const pdfFile = pdfFiles[0];

  // Validate image file
  if (!imageFile.mimetype.startsWith('image')) {
    return next(new CustomError.BadRequestError('Please upload an image'));
  }

  if (imageFile.size > MAX_IMAGE_SIZE) {
    return next(
      new CustomError.BadRequestError('Image file size should be under 5 MB')
    );
  }

  // Validate PDF file
  if (pdfFile.mimetype !== 'application/pdf') {
    return next(
      new CustomError.BadRequestError('Please upload file in PDF format')
    );
  }

  if (pdfFile.size > MAX_PDF_SIZE) {
    return next(
      new CustomError.BadRequestError(
        'PDF file size is too large, upload less than 30 MB'
      )
    );
  }

  next();
};
