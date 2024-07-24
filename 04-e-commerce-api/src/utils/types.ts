import { Request } from 'express';
import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface IQueryObject {
  featured?: boolean;
  company?: string;
  name?: { $regex: string; $options: string };
  price?: { [key: string]: number };
  rating?: { [key: string]: number };
}

export interface IQuery {
  featured?: string;
  company?: string;
  name?: string;
  sort?: string;
  fields?: string;
  numericFilters?: string;
}

interface IBaseUser {
  userId: string;
  name: string;
  role: string;
}

export type IPayload = IBaseUser;

export interface IJwtTokenPayload extends JwtPayload {
  payload: IPayload;
}

export interface ICookieTokenPayload {
  res: Response;
  tokenUser: IBaseUser;
}

export interface IUser extends IBaseUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  createJWT(payload: IJwtTokenPayload): string;
  comparePassword(password: string): boolean;
}

export interface IAuthRequest extends Request {
  user?: IPayload;
}


export interface IOrderItem {
  name: string;
  price: number;
  image: string;
  amount: number;
  product: mongoose.Types.ObjectId;
}

export interface IOrder {
  tax: number;
  shippingFee: number;
  items: IOrderItem[];
}