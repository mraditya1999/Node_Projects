import { upload } from '../config';

interface IFieldConfig {
  name: string;
  maxCount: number;
}

/**
 * @description Middleware for uploading a single file
 * @param {string} fieldName - The name of the field for the file upload
 * @returns {Function} - The multer middleware for single file upload
 */
export const uploadSingleFile = (fieldName: string) => upload.single(fieldName);

/**
 * @description Middleware for uploading multiple files
 * @param {IFieldConfig[]} fields - An array of field configurations for the file uploads
 * @returns {Function} - The multer middleware for multiple file uploads
 */
export const uploadMultipleFile = (fields: IFieldConfig[]) =>
  upload.fields(fields);
