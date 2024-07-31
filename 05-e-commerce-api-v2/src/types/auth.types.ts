import { Response } from 'express';

export interface IRegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface IRegisterUserResponse {
  message: string;
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

export interface IForgetPasswordRequest {
  email: string;
}

export interface IForgetPasswordRequest {
  email: string;
}

export interface IForgetPasswordResponse {
  message: string;
}

export interface IResetPasswordRequest {
  token: string;
  email: string;
  password: string;
}

export interface IResetPasswordResponse {
  message: string;
}

// Login and Register User Response
export interface IUserResponse {
  user: ITokenUser;
}

export interface ICookieTokenPayload {
  res: Response;
  tokenUser: ITokenUser;
  refreshToken?: string;
}

export interface IJwtTokenPayload {
  payload: {
    tokenUser: ITokenUser;
    refreshToken?: string;
  };
}
