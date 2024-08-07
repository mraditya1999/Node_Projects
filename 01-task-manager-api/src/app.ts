import express from 'express';
// extra security packages
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config/config';
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
  authenticateUserMiddleware,
} from './middlewares';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();
const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
};

// middlewares
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/task', authenticateUserMiddleware, taskRoutes);

// Custom middlewares
app.use(notFoundMiddleware); // For 404 errors
app.use(errorHandlerMiddleware); // Global error handler

export default app;
