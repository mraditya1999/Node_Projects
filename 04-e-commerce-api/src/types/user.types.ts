import { ITokenUser } from './auth.types';
import { IUserDocument } from './model.types';

// Request types
export interface IUpdateUserRequest {
  name: string;
  email: string;
}

export interface IUpdateUserPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface IDeleteUserRequest {
  id: string;
}

// Response types
export interface IGetAllUsersResponse {
  users: IUserDocument[];
}

export interface IGetSingleUserResponse {
  user: IUserDocument;
}

export interface IShowCurrentUserResponse {
  user?: ITokenUser;
}

export interface IUpdateUserResponse {
  user: ITokenUser;
}

export interface IUpdateUserPasswordResponse {
  message: string;
}

export interface IDeleteUserResponse {
  message: string;
}
