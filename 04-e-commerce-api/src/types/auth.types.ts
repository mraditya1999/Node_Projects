import { Response } from 'express';

export interface IRegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUserRequest {
  email: string;
  password: string;
}

export interface ILogoutUserResponse {
  message: string;
}

export interface ITokenUser {
  userId: string;
  name: string;
  role: string;
}

export interface IUserResponse {
  user: ITokenUser;
}

export interface ICookieTokenPayload {
  res: Response;
  tokenUser: ITokenUser;
}
