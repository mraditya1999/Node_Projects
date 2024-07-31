// cloudinary Result
// export interface ICloudinaryResult {
//   url: string;
//   public_id: string;
//   secure_url: string;
// }

type ICloudinaryResult = string;

// Upload Image
export interface IUploadImageRequest {
  file?: Express.Multer.File;
}

export interface IUploadImageResponse {
  message: string;
  file: ICloudinaryResult;
}

export interface IUploadFileErrorResponse {
  message: string;
}

// Upload PDF
export interface IUploadPdfRequest {
  file?: Express.Multer.File;
}

export interface IUploadPdfResponse {
  message: string;
  file: ICloudinaryResult;
}

//   Upload Files
export interface IUploadFilesRequest {
  files?: {
    image?: Express.Multer.File[];
    pdf?: Express.Multer.File[];
  };
}

export interface IUploadedFile {
  type: 'image' | 'pdf';
  file: ICloudinaryResult;
}

export interface IUploadFilesResponse {
  message: string;
  files: IUploadedFile[];
}
