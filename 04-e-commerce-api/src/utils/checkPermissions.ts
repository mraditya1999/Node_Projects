import mongoose from 'mongoose';
import { CustomError } from '../errors';
import { IPayload } from '../utils';

// ===========================================================================================
//                                  CHECK PERMISSIONS
// ===========================================================================================

// This function checks the permissions of a user attempting to access a resource.
// It allows access if the user is an admin or if the user ID matches the resource owner.
// If the user does not have the necessary permissions, an error is thrown.
/**
 * @description Check user permissions to access a resource
 * @param {IPayload | undefined} requestUser - The user making the request
 * @param {string} resourceUserId - The ID of the resource owner
 * @throws {CustomError.UnauthenticatedError} If the user is not authorized
 * @route Middleware
 * @access Private
 */
// ===========================================================================================
export const checkPermissions = (
  requestUser: IPayload | undefined,
  resourceUserId: mongoose.Types.ObjectId
) => {
  if (requestUser?.role === 'admin') return;
  if (requestUser?.userId === resourceUserId.toString()) return;

  throw new CustomError.UnauthenticatedError(
    'Not authorized to access this route'
  );
};
