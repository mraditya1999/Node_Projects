import path from 'node:path';
import fs from 'node:fs';
import cloudinary from './cloudinary';
import { BadRequestError, NotFoundError } from '../errors';

export const uploadOnCloudinary = async (
  file: Express.Multer.File,
  folderNameOnCloudinary: string
) => {
  if (!file) {
    throw new BadRequestError('Invalid file object');
  }

  const fileName = file.originalname;
  const uploadDir = path.resolve(__dirname, '../../public/uploads');
  const filePath = path.join(uploadDir, fileName);

  if (!filePath || !fs.existsSync(filePath)) {
    throw new NotFoundError(`File not found: ${filePath}`);
  }

  const response = await cloudinary.uploader.upload(filePath, {
    resource_type: 'auto',
    type: 'upload',
    folder: folderNameOnCloudinary,
    filename_override: fileName,
    access_mode: 'public',
    allowed_formats: ['pdf', 'jpeg', 'png', 'svg', 'jpg', 'webp'],
    use_filename: true,
    use_asset_folder_as_public_id_prefix: true,
    // public_id: `${folderNameOnCloudinary}/${fileName}`,
  });

  if (!response) {
    throw new BadRequestError(`Failed to upload file: ${fileName}`);
  }

  // Remove the local file after successful upload
  fs.unlinkSync(filePath);
  return response.secure_url.toString();
};

export const deleteFromCloudinary = async (publicId: string) => {
  const { result } = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image', // same for pdf and image
    invalidate: true,
  });
  return result;
};

export const updateOnCloudinary = async (
  file: Express.Multer.File,
  folderName: string,
  publicId?: string
) => {
  if (!file) {
    throw new BadRequestError('Invalid file object');
  }

  if (publicId) {
    try {
      await deleteFromCloudinary(publicId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        `Failed to delete old file from Cloudinary: ${error.message}`
      );
    }
  }

  const uploadResult = await uploadOnCloudinary(file, folderName);
  if (!uploadResult) {
    throw new BadRequestError('Failed to upload the new file');
  }

  return uploadResult;
};

export const getPublicIdFromUrl = (url: string) => {
  // URL - http://res.cloudinary.com/dmrdplrx2/image/upload/v1719991678/book-covers/pexels.jpg.jpg
  //  Public Key - book-covers/pexels.jpg
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split('/');
  const publicId = parts[parts.length - 2] + '/' + parts[parts.length - 1];
  return publicId.substring(0, publicId.lastIndexOf('.'));
};

export const getFriendlyMimeType = (file: Express.Multer.File): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [type, subtype] = file.mimetype.split('/');
  return subtype;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 5MB
const MAX_BOOK_SIZE = 10 * 1024 * 1024; // 30MB

// Validate image file function
export const validateImageFile = (file: Express.Multer.File) => {
  if (!file.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload an Image');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new BadRequestError(
      'File size is too large, Upload image less than 2 MB'
    );
  }
};

// Validate PDF file function
export const validatePdfFile = (file: Express.Multer.File) => {
  if (getFriendlyMimeType(file) !== 'pdf') {
    throw new BadRequestError('Please upload book in pdf format');
  }

  if (file.size > MAX_BOOK_SIZE) {
    throw new BadRequestError(
      'File size is too large, Upload book less than 30 MB'
    );
  }
};
