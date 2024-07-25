import { Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import { CustomError } from '../errors';
import { createTokenUser, attachCookiesToResponse } from '../utils';
import {
  ILoginUserRequest,
  ILogoutUserResponse,
  IRegisterUserRequest,
  ITokenUser,
  IUserResponse,
} from '../types/auth.types';

// ==========================================================================================
//                                 REGISTER USER
// ==========================================================================================

// This section handles the registration of a new user.
// It checks for existing email addresses, creates a new user,
// assigns a role, and sends back a token and user information.
/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
// ==========================================================================================
export const registerUser = async (
  req: Request<Record<string, never>, ITokenUser, IRegisterUserRequest>,
  res: Response<IUserResponse>
) => {
  const { name, email, password } = req.body;

  const isEmailAlreadyExist = await User.findOne({ email });
  if (isEmailAlreadyExist) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first user will be registered as admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);

  // Create Jwt token
  // const token = user.createJWT({ payload: tokenUser }); // mongoDb Instance OR utils
  // const token = createJWT({ payload: tokenUser }); used in jwt utils

  // attach cookie in response
  attachCookiesToResponse({ res, tokenUser });
  return res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// ==========================================================================================
//                                   LOGIN USER
// ==========================================================================================

// This section manages user login functionality.
// It verifies user credentials, checks for the existence of the user,
// and responds with a token and user information upon successful login.
/**
 * @description Log in a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
// ==========================================================================================
export const loginUser = async (
  req: Request<Record<string, never>, IUserResponse, ILoginUserRequest>,
  res: Response<IUserResponse>
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('User does not exist');
  }

  const isPasswordCorrect = user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid email or password');
  }

  const tokenUser = createTokenUser(user);
  // Create Jwt token
  // const token = user.createJWT({ payload: tokenUser }); // user instance OR utils
  // const token = createJWT({ payload: tokenUser });

  attachCookiesToResponse({ res, tokenUser });
  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

// ===========================================================================================
//                                   LOGOUT USER
// ===========================================================================================

// This section handles user logout functionality.
// It invalidates the user's session by clearing the authentication cookie
// and responds with a success message.
/**
 * @description Log out a user
 * @route POST /api/v1/auth/logout
 * @access Public
 */
// ===========================================================================================
export const logoutUser = async (
  req: Request<
    Record<string, never>,
    ILogoutUserResponse,
    Record<string, never>
  >,
  res: Response<ILogoutUserResponse>
) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: 'User Logged out' });
};
