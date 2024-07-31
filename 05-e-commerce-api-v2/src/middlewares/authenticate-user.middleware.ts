import { Response, NextFunction, Request } from "express-serve-static-core";
import { CustomError } from "../errors";
import { attachCookiesToResponse, verifyJWT } from "../utils";
import { IJwtTokenPayload } from "../types/auth.types";
import { Token } from "../models";

// ==========================================================================================
//                                 AUTHENTICATE USER
// ==========================================================================================

// This section handles user authentication using access and refresh tokens.
// It verifies the access token first, and if it's invalid or missing, it verifies the refresh token.
// If the refresh token is valid, it checks the token in the database and reattaches cookies.
// It throws an error if authentication fails at any step.
/**
 * @description Authenticate user with access and refresh tokens
 * @route Middleware
 * @access Private
 */
// ==========================================================================================
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = verifyJWT(accessToken) as IJwtTokenPayload;
      req.user = payload;
      return next();
    }
    const { payload } = verifyJWT(refreshToken) as IJwtTokenPayload;
    // Get token from db
    const existingToken = await Token.findOne({
      user: payload.tokenUser.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError(
        "Authentication Failed! Invalid Token"
      );
    }

    attachCookiesToResponse({
      res,
      tokenUser: payload.tokenUser,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.tokenUser;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
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
        "Not authorized to access this route"
      );
    }
    next();
  };
};

export default authenticateUser;
