import express from 'express';
import 'express-async-errors';
// extra security packages
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';

import { config } from './config/config';
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
  authenticateUserMiddleware,
} from './middlewares';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';

const app = express();
const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
};
const rateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
};

// middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimit(rateLimitOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public')); // static data

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/book', authenticateUserMiddleware, bookRoutes);

// Custom middlewares
app.use(notFoundMiddleware); // For 404 errors
app.use(errorHandlerMiddleware); // Global error handler

export default app;
