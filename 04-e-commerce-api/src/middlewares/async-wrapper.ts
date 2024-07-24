import { Request, Response, NextFunction } from 'express';

// ===========================================================================================
//                                  ASYNC WRAPPER
// ===========================================================================================

// This middleware wraps asynchronous route handlers and middleware functions.
// It catches errors thrown in async functions and passes them to the next middleware.
// It enhances code readability and reduces repetitive try-catch blocks.
/**
 * @description Wrap asynchronous functions to catch errors
 * @route Middleware
 * @access Private
 */
// ===========================================================================================
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
