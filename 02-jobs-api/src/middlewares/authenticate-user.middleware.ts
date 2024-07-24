import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { config } from '../config/config';
import { IPayload, IAuthRequest } from '../types/request.types';

const authenticateUser = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Unauthorized: Invalid token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret) as IPayload;
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Authentication invalid');
  }
};

export default authenticateUser;
