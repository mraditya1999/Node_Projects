import { Types } from 'mongoose';

// Type for Order Item
export interface IOrderItem {
  product: Types.ObjectId;
  amount: number;
}

// Type for Order
export interface IOrder {
  items: IOrderItem[];
  tax: number;
  shippingFee: number;
}

// Request and Response types for Create Order
export interface ICreateOrderRequest {
  items: IOrderItem[];
  tax: number;
  shippingFee: number;
}

export interface ICreateOrderResponse {
  order: {
    orderItems: IOrderItem[];
    total: number;
    subTotal: number;
    tax: number;
    shippingFee: number;
    clientSecret: string;
    user: Types.ObjectId;
  };
  clientSecret: string;
}

// Request and Response types for Update Order
export interface IUpdateOrderRequest {
  paymentIntentId: string;
}

export interface IUpdateOrderResponse {
  order: {
    orderItems: IOrderItem[];
    total: number;
    subTotal: number;
    tax: number;
    shippingFee: number;
    clientSecret: string;
    user: Types.ObjectId;
    paymentIntentId: string;
    status: string;
  };
}

// Request and Response types for Get All Orders
export interface IGetAllOrdersResponse {
  orders: Array<{
    orderItems: IOrderItem[];
    total: number;
    subTotal: number;
    tax: number;
    shippingFee: number;
    clientSecret: string;
    user: Types.ObjectId;
    paymentIntentId: string;
    status: string;
  }>;
  count: number;
}

// Request and Response types for Get Single Order
export interface IGetSingleOrderRequest {
  id: string;
}

export interface IGetSingleOrderResponse {
  order: {
    orderItems: IOrderItem[];
    total: number;
    subTotal: number;
    tax: number;
    shippingFee: number;
    clientSecret: string;
    user: Types.ObjectId;
    paymentIntentId: string;
    status: string;
  };
}

// Request and Response types for Get Current User Orders
export interface IGetCurrentUserOrdersResponse {
  orders: Array<{
    orderItems: IOrderItem[];
    total: number;
    subTotal: number;
    tax: number;
    shippingFee: number;
    clientSecret: string;
    user: Types.ObjectId;
    paymentIntentId: string;
    status: string;
  }>;
  count: number;
}
