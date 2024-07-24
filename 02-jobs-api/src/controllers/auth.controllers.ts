import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthorizedError } from '../errors';
import User from '../models/user.models';

export const loginUser = async (req: Request, res: Response) => {
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
};

export const registerUser = async (req: Request, res: Response) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  return res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token });
};
