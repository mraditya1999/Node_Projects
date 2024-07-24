import { IUser } from '../utils';

// ===========================================================================================
//                                  CREATE TOKEN USER
// ===========================================================================================

/**
 * @description Creates a token user object from the user data
 * @param {IUser} user - The user object
 * @returns {{ userId: string, name: string, role: string }} - The token user object
 */
export const createTokenUser = (user: IUser) => {
  return { userId: user._id.toString(), name: user.name, role: user.role };
};
