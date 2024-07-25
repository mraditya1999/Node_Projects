import { Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

// ===========================================================================================
//                                   NOT FOUND MIDDLEWARE
// ===========================================================================================

// This middleware handles 404 errors for routes that do not exist.
// It responds with a 404 status code and a message indicating the route is not found.
/**
 * @description Handles 404 errors for non-existing routes
 * @route Middleware
 * @access Public
 */
const notFound = (req: Request, res: Response) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: 'Route does not exist' });
};

export default notFound;
