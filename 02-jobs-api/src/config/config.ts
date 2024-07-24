import { config as conf } from 'dotenv';
conf();

export interface IConfig {
  port: string;
  databaseUrl: string;
  env: string;
  jwtSecret: string;
  jwtLifetime: string;
  corsOrigin: string;
}

const _config: IConfig = {
  port: process.env.PORT ?? '',
  databaseUrl: process.env.MONGO_CONNECTION_STRING ?? '',
  env: process.env.NODE_ENV ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtLifetime: process.env.JWT_LIFETIME ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? '',
};

export const config = Object.freeze(_config);
