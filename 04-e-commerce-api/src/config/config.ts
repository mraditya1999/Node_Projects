import { config as conf } from 'dotenv';
conf();

interface IConfig {
  port: number;
  databaseUrl: string;
  env: string;
  jwtSecret: string;
  jwtLifetime: string;
  frontendUrl: string;
  cloudinaryCloudName: string;
  cloudinaryAPIKey: string;
  cloudinaryAPISecret: string;
  mailService: string;
  mailHost: string;
  mailPort: number;
  gmailName: string;
  gmailUsername: string;
  gmailPassword: string;
}

const _config: IConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.MONGO_CONNECTION_STRING ?? '',
  env: process.env.NODE_ENV ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtLifetime: process.env.JWT_LIFETIME ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET ?? '',
  mailService: process.env.MAIL_SERVICE ?? '',
  mailHost: process.env.MAIL_HOST ?? '',
  mailPort: parseInt(process.env.MAIL_PORT || '0', 10),
  gmailName: process.env.GMAIL_NAME ?? '',
  gmailUsername: process.env.GMAIL_USERNAME ?? '',
  gmailPassword: process.env.GMAIL_PASSWORD ?? '',
};

const config = Object.freeze(_config);
export default config;
