import { IReviewDocument } from './model.types';
import { IUserResponse } from './auth.types';

// Interfaces for Request and Response bodies
export interface ICreateReviewRequest extends IUserResponse {
  product: string;
  rating: number;
  title: string;
  comment: string;
}

export interface ICreateReviewResponse {
  review: IReviewDocument;
}

export interface IUpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface IUpdateReviewResponse {
  review: IReviewDocument;
}

export interface IGetReviewsResponse {
  reviews: IReviewDocument[];
  count: number;
}

export interface IGetSingleReviewResponse {
  review: IReviewDocument;
}

export interface IDeleteReviewResponse {
  message: string;
}
