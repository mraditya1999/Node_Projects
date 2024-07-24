import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/config';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryAPIKey,
  api_secret: config.cloudinaryAPISecret,
});

export default cloudinary;
