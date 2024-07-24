import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models';
import { CustomError } from '../errors';
import { IAuthRequest, IUser } from '../utils';
import {
  attachCookiesToResponse,
  checkPermissions,
  createTokenUser,
} from '../utils';

// ===========================================================================================
//                                   GET ALL USERS
// ===========================================================================================

// This endpoint retrieves all users with the role 'user'.
// It is accessible only to authenticated admin users.
// The response excludes the users' passwords for security reasons.
/**
 * @description Get all users with role 'user'
 * @route GET /api/v1/users
 * @access Private/Admin
 */
// ===========================================================================================
export const getAllUsers = async (req: IAuthRequest, res: Response) => {
  const users = await User.find({ role: 'user' }).select('-password');
  return res.status(StatusCodes.OK).json({ users });
};

// ===========================================================================================
//                                   GET SINGLE USER
// ===========================================================================================

// This endpoint retrieves a single user by their ID.
// It is accessible only to authenticated admin users.
// If the user is not found, a BadRequestError is thrown.
// The response excludes the user's password for security reasons.
/**
 * @description Get a single user by ID
 * @route GET /api/v1/users/:id
 * @access Private/Admin
 */
// ===========================================================================================
export const getSingleUser = async (req: IAuthRequest, res: Response) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select('-password');

  if (!user) {
    throw new CustomError.BadRequestError(`No user with id : ${userId}`);
  }

  checkPermissions(req.user, user._id);
  return res.status(StatusCodes.OK).json({ user });
};

// ===========================================================================================
//                                   SHOW CURRENT USER
// ===========================================================================================

// This endpoint retrieves the currently logged-in user's information.
// It is accessible only to authenticated users.
// If the user is not authenticated, an UNAUTHORIZED error is returned.
// On success, it returns the user's details and a success status.
/**
 * @description Show the current logged-in user
 * @route GET /api/v1/users/showMe
 * @access Private
 */
// ===========================================================================================
export const showCurrentUser = async (req: IAuthRequest, res: Response) => {
  return res.status(StatusCodes.OK).json({ user: req.user });
};

// ===========================================================================================
//                                    UPDATE USER DETAILS
// ===========================================================================================

// This endpoint allows authenticated users to update their details.
// It requires the user to provide their name and email.
// If any fields are missing, a BAD REQUEST error is thrown.
// Upon successful update, the user's information is returned along with a success status.
/**
 * @description Update user details
 * @route PATCH /api/v1/users/updateUser
 * @access Private
 */
// ===========================================================================================
export const updateUser = async (req: IAuthRequest, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError('All fields are required');
  }

  const userId = req.user?.userId;
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { email, name },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new CustomError.NotFoundError(`No user with id : ${userId}`);
  }

  const tokenUser = createTokenUser(updatedUser.toObject() as IUser);
  attachCookiesToResponse({ res, tokenUser });

  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

// ===========================================================================================
//                                    UPDATE USER PASSWORD
// ===========================================================================================

// This endpoint allows authenticated users to update their password.
// It requires the user to provide their old password and a new password.
// If any fields are missing, a BAD REQUEST error is thrown.
// The user's old password is verified, and if correct, the password is updated successfully.
// A success message is returned upon completion.
/**
 * @description Update user password
 * @route PATCH /api/v1/users/updateUserPassword
 * @access Private
 */
// ===========================================================================================
export const updateUserPassword = async (req: IAuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('All fields are required');
  }

  const userId = req.user?.userId;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${userId}`);
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials!');
  }

  user.password = newPassword;
  await user.save();

  return res.status(StatusCodes.OK).json({ message: 'Password Updated ' });
};

// ===========================================================================================
//                                      DELETE USER
// ===========================================================================================

// This endpoint allows an admin to delete a user by their ID.
// It requires the user to be authenticated and have admin privileges.
// If the specified user is not found, a NOT FOUND error is thrown.
// Upon successful deletion, a success message is returned.
/**
 * @description Delete a user by ID
 * @route DELETE /api/v1/users/:userId
 * @access Private/Admin
 */
// ===========================================================================================
export const deleteUser = async (req: IAuthRequest, res: Response) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${userId}`);
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: 'User deleted successfully!' });
};
