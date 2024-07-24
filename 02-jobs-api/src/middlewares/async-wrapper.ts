import { Request, Response, NextFunction } from 'express';

const asyncWrapper = <T>(
  cb: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncWrapper;
