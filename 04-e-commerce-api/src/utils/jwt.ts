import jwt from 'jsonwebtoken';
import { ICookieTokenPayload, IJwtTokenPayload } from '../utils';
import { config } from '../config';

// ===========================================================================================
//                                  CREATE JWT TOKEN
// ===========================================================================================

/**
 * @description Creates a JWT token for the given payload.
 * @param {IJwtTokenPayload} payload - The payload to include in the JWT.
 * @returns {string} - The generated JWT token as a string.
 */
export const createJWT = (payload: IJwtTokenPayload): string => {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtLifetime,
  });
  return token;
};

// ===========================================================================================
//                                  VERIFY JWT TOKEN
// ===========================================================================================

/**
 * @description Verifies a given JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {object | string} - The decoded payload of the token.
 */
export const verifyJWT = ({ token }: { token: string }) => {
  return jwt.verify(token, config.jwtSecret);
};

// ===========================================================================================
//                                  ATTACH JWT COOKIE
// ===========================================================================================

/**
 * @description Attaches a JWT token as a cookie to the response.
 * @param {object} params - The parameters.
 * @param {Response} params.res - The Express response object.
 * @param {IJwtTokenPayload} params.tokenUser - The user information to include in the JWT payload.
 */
export const attachCookiesToResponse = ({
  res,
  tokenUser,
}: ICookieTokenPayload) => {
  const token = createJWT({ payload: tokenUser });

  const oneDay = 24 * 60 * 60 * 1000; // same as config.jwtLifetime
  const expireTime = new Date(Date.now() + oneDay);

  res.cookie('token', token, {
    httpOnly: true,
    expires: expireTime,
    secure: config.env === 'production' ? true : false,
    signed: true,
  });
};
