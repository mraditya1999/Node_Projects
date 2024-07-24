import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

// User
export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createJWT(): string;
  comparePassword(userPassword: string): Promise<boolean>;
}

// Product
export interface IProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'office' | 'kitchen' | 'bedroom';
  company: 'ikea' | 'liddy' | 'marcos';
  colors: string[];
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  averageRating: number;
  numOfReviews: number;
  user: ObjectId;
}

// Review
export interface IReviewDocument extends Document {
  rating: number;
  title: string;
  comment: string;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
}

// Order
export interface IOrderDocument extends Document {
  tax: number;
  shippingFee: number;
  subTotal: number;
  total: number;
  orderItems: [mongoose.Schema];
  status: 'pending' | 'failed' | 'paid' | 'delivered' | 'cancelled';
  user: mongoose.Types.ObjectId;
  clientSecret: string;
  paymentIntentId: string;
}
