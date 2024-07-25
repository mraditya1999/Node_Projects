import { IUserDocument } from '../types/model.types';

// ===========================================================================================
//                                  CREATE TOKEN USER
// ===========================================================================================

/**
 * @description Creates a token user object from the user data
 * @param {IUser} user - The user object
 * @returns {{ userId: string, name: string, role: string }} - The token user object
 */
export const createTokenUser = (user: IUserDocument) => {
  user.body;
  return { userId: user._id.toString(), name: user.name, role: user.role };
};
