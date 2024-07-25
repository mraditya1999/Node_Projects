import { Response, NextFunction, Request } from 'express-serve-static-core';
import { CustomError } from '../errors';
import { verifyJWT } from '../utils';
import { ITokenUser } from '../types/auth.types';

// ===========================================================================================
//                                  AUTHENTICATE USER
// ===========================================================================================

// This middleware authenticates a user using a JWT stored in signed cookies.
// It checks for the presence of a token and verifies its validity.
// If the token is valid, the user information is attached to the request object.
// If authentication fails, an error is thrown.
/**
 * @description Authenticate user using JWT from cookies
 * @route Middleware
 * @access Private
 */
// ===========================================================================================
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  If token is in request
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   throw new CustomError.UnauthenticatedError('Unauthenticated: Invalid token');
  // }
  // const token = authHeader.split(' ')[1];

  // If token is in cookie
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const payload = verifyJWT({ token }) as ITokenUser;
    req.user = payload;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

// ===========================================================================================
//                                   AUTHORIZE PERMISSIONS
// ===========================================================================================

// This middleware checks if the authenticated user has the necessary roles
// to access a specific route. It compares the user's role against an array
// of allowed roles. If the user's role is not authorized, an error is thrown.
/**
 * @description Authorize user based on roles
 * @route Middleware
 * @access Private
 * @param {string[]} roles - Array of roles to check against
 */
// ===========================================================================================
export const authorizePermissions = (...roles: (string | undefined)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user?.role)) {
      throw new CustomError.UnauthorizedError(
        'Not authorized to access this route'
      );
    }
    next();
  };
};

export default authenticateUser;
