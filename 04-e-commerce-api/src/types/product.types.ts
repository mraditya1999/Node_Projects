// types/requests.ts
import { IProductDocument } from './model.types';
import { IUserResponse } from './auth.types';

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
  page?: string;
  limit?: string;
}

export interface ICreateProductRequest extends IUserResponse {
  body: {
    name: string;
    price: number;
    description: string;
    company: string;
    user: string;
  };
  file?: {
    path: string;
  };
}

export interface IUpdateProductRequest {
  name?: string;
  price?: number;
  description?: string;
  company?: string;
  featured?: boolean;
  image?: string;
  file?: {
    path: string;
  };
}

// types/responses.ts

export interface IGetAllProductsResponse {
  products: IProductDocument[];
  count: number;
}

export interface IGetSingleProductResponse {
  product: IProductDocument;
}

export interface ICreateProductResponse {
  product: IProductDocument;
}

export interface IUpdateProductResponse {
  product: IProductDocument;
}

export interface IDeleteProductResponse {
  message: string;
}
