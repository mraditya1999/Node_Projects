import { config as conf } from 'dotenv';
conf();

export interface IConfig {
  port: string;
  databaseUrl: string;
  env: string;
  jwtSecret: string;
  jwtLifetime: string;
  corsOrigin: string;
  cloudinaryCloudName: string;
  cloudinaryAPIKey: string;
  cloudinaryAPISecret: string;
  gmailName: string;
  gmailUsername: string;
  gmailPassword: string;
}

const _config: IConfig = {
  port: process.env.PORT ?? '',
  databaseUrl: process.env.MONGO_CONNECTION_STRING ?? '',
  env: process.env.NODE_ENV ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtLifetime: process.env.JWT_LIFETIME ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET ?? '',
  gmailName: process.env.GMAIL_NAME ?? '',
  gmailUsername: process.env.GMAIL_USERNAME ?? '',
  gmailPassword: process.env.GMAIL_PASSWORD ?? '',
};

export const config = Object.freeze(_config);
