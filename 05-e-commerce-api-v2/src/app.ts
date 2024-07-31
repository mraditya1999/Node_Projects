// imports
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';

// custom imports
import { config } from './config';
import { notFoundMiddleware, errorHandlerMiddleware } from './middlewares';
import {
  authRoutes,
  productRoutes,
  userRoutes,
  emailRoutes,
  reviewRoutes,
  uploadRoutes,
  orderRoutes,
} from './routes';

// configurations
const app = express();
const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
};
const rateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 60, // Limit each IP to 60 requests per `window` (here, per 15 minutes).
};

// middlewares
app.set('trust proxy', 1);
app.use(morgan('dev'));
app.use(helmet());
app.use(mongoSanitize()); // sanitize data before saving to database
app.use(cors(corsOptions));
app.use(rateLimit(rateLimitOptions));
app.use(express.json()); // access json data inside req.body
app.use(cookieParser(config.jwtSecret)); // access cookie data inside req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // static data

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/send', emailRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/send', emailRoutes);

// Custom middlewares
app.use(notFoundMiddleware); // For 404 errors
app.use(errorHandlerMiddleware); // Global error handler

export default app;
