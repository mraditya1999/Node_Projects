import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthorizedError } from '../errors';
import User from '../models/user.models';
import asyncWrapper from '../middlewares/async-wrapper';

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
export const loginUser = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordCorrect = user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = user.createJWT();
  return res
    .status(StatusCodes.OK)
    .json({ user: { userId: user._id, name: user.name }, token });
});

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
export const registerUser = asyncWrapper(
  async (req: Request, res: Response) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    return res
      .status(StatusCodes.CREATED)
      .json({ user: { name: user.name }, token });
  }
);
