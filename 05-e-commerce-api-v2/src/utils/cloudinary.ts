import fs from 'node:fs';
import { cloudinary } from '../config';
import { CustomError } from '../errors';

// ===========================================================================================
//                                  UPLOAD TO CLOUDINARY
// ===========================================================================================

/**
 * @description Uploads a file to Cloudinary
 * @param {string} localFilePath - The local path of the file to upload
 * @param {string} folderNameOnCloudinary - The Cloudinary folder name
 * @returns {Promise<string>} - The secure URL of the uploaded file
 * @throws {CustomError.NotFoundError} If the local file does not exist
 * @throws {CustomError.BadRequestError} If the upload to Cloudinary fails
 */
export const uploadOnCloudinary = async (
  localFilePath: string,
  folderNameOnCloudinary: string
): Promise<string> => {
  if (!fs.existsSync(localFilePath)) {
    throw new CustomError.NotFoundError(`File not found: ${localFilePath}`);
  }

  const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: 'auto',
    folder: folderNameOnCloudinary,
    use_filename: true,
    overwrite: true,
    unique_filename: true,
    use_asset_folder_as_public_id_prefix: true,
    // type: 'upload',
    // filename_override: fileName,
    // access_mode: 'public',
    // allowed_formats: ['pdf', 'jpeg', 'png', 'svg', 'jpg', 'webp'],
    // public_id: `${folderNameOnCloudinary}/${fileName}`,
  });

  if (!response) {
    throw new CustomError.BadRequestError(`Failed to upload file`);
  }

  // Remove the local file after successful upload
  fs.unlinkSync(localFilePath);
  return response.secure_url;
};

// ===========================================================================================
//                                  DELETE FROM CLOUDINARY
// ===========================================================================================

/**
 * @description Deletes a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<string>} - The result of the delete operation
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<string> => {
  const { result } = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image', // same for pdf and image
    invalidate: true,
  });
  return result;
};

// ===========================================================================================
//                                  UPDATE ON CLOUDINARY
// ===========================================================================================

/**
 * @description Updates a file on Cloudinary
 * @param {string} localFilePath - The local path of the new file to upload
 * @param {string} folderName - The Cloudinary folder name
 * @param {string} [publicId] - The public ID of the old file to delete
 * @returns {Promise<string>} - The secure URL of the uploaded file
 * @throws {CustomError.BadRequestError} If the upload to Cloudinary fails
 */
export const updateOnCloudinary = async (
  localFilePath: string,
  folderName: string,
  publicId?: string
): Promise<string> => {
  if (publicId) {
    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to delete old file from Cloudinary: ${error.message}`
        );
      } else {
        console.error(error);
      }
    }
  }

  const uploadResult = await uploadOnCloudinary(localFilePath, folderName);
  if (!uploadResult) {
    throw new CustomError.BadRequestError('Failed to upload the new file');
  }

  return uploadResult;
};

// ===========================================================================================
//                                  EXTRACT PUBLIC ID FROM URL
// ===========================================================================================

/**
 * @description Extracts the public ID from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string} - The extracted public ID
 */
export const getPublicIdFromUrl = (url: string): string => {
  // URL - http://res.cloudinary.com/dmrdplrx2/image/upload/v1719991678/book-covers/pexels.jpg.jpg
  //  Public Key - book-covers/pexels.jpg
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split('/');
  const publicId = parts[parts.length - 2] + '/' + parts[parts.length - 1];
  return publicId.substring(0, publicId.lastIndexOf('.'));
};

// ===========================================================================================
//                                  GET FRIENDLY MIME TYPE
// ===========================================================================================

/**
 * @description Gets the friendly MIME type of a file
 * @param {Express.Multer.File} file - The file to get the MIME type of
 * @returns {string} - The friendly MIME type
 */
export const getFriendlyMimeType = (file: Express.Multer.File): string => {
  return file.mimetype.split('/')[1];
};
