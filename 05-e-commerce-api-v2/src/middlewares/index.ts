export { default as errorHandlerMiddleware } from './error-handler.middleware';
export { default as notFoundMiddleware } from './not-found.middleware';

export { validateImageFile, validatePdfFile,validateImageAndPdfFiles } from './validate-file';
export { uploadSingleFile, uploadMultipleFile } from './fileUpload';
export {
  authenticateUser,
  authorizePermissions,
} from './authenticate-user.middleware';
