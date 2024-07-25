import { Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../errors';
import { Order, Product } from '../models';
import { checkPermissions } from '../utils';
import {
  ICreateOrderRequest,
  ICreateOrderResponse,
  IGetAllOrdersResponse,
  IGetCurrentUserOrdersResponse,
  IGetSingleOrderRequest,
  IGetSingleOrderResponse,
  IOrderItem,
  IUpdateOrderRequest,
  IUpdateOrderResponse,
} from '../types/order.types';

// ===========================================================================================
//                                   FAKE STRIPE API
// ===========================================================================================

/**
 * @description Fake Stripe API for demonstration purposes.
 * @param {Object} params - The parameters for the fake Stripe API.
 * @param {number} params.amount - The amount for the payment.
 * @param {string} params.currency - The currency for the payment.
 * @returns {Object} The fake Stripe API response containing a clientSecret and the amount.
 */
const fakeStripeApi = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}): {
  clientSecret: string;
  amount: number;
} => {
  const clientSecret = 'someRandomId';
  console.log(currency);
  return { clientSecret, amount };
};

// ===========================================================================================
//                                   CREATE ORDER
// ===========================================================================================

/**
 * @description Create a new order.
 * @route POST /api/v1/orders
 * @access Private
 */
export const createOrder = async (
  req: Request<
    Record<string, never>,
    ICreateOrderResponse,
    ICreateOrderRequest
  >,
  res: Response
) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.NotFoundError(
      'Please provide a tax and shipping amount'
    );
  }

  let orderItems: IOrderItem[] = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id ${item.product}`);
    }

    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subTotal
    subTotal += item.amount * price;
  }

  // calculate total
  const total = tax + shippingFee + subTotal;

  // get client secret
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: 'inr',
  });

  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user?.userId,
  });
  return res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

// ===========================================================================================
//                                   UPDATE ORDER
// ===========================================================================================

/**
 * @description Update an existing order.
 * @route PATCH /api/v1/orders/:id
 * @access Private
 */
export const updateOrder = async (
  req: Request<
    {
      id: string;
    },
    IUpdateOrderResponse,
    IUpdateOrderRequest
  >,
  res: Response<IUpdateOrderResponse>
) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();
  return res.status(StatusCodes.OK).json({ order });
};

// ===========================================================================================
//                                   GET ALL ORDERS
// ===========================================================================================

/**
 * @description Get all orders.
 * @route GET /api/v1/orders
 * @access Private
 */
export const getAllOrders = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>
  >,
  res: Response<IGetAllOrdersResponse>
) => {
  const orders = await Order.find({});
  return res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

// ===========================================================================================
//                                   GET SINGLE ORDER
// ===========================================================================================

/**
 * @description Get a single order by ID.
 * @route GET /api/v1/orders/:id
 * @access Private
 */
export const getSingleOrder = async (
  req: Request<
    Record<string, never>,
    IGetSingleOrderResponse,
    IGetSingleOrderRequest
  >,
  res: Response<IGetSingleOrderResponse>
) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }

  checkPermissions(req.user, order.user);
  return res.status(StatusCodes.OK).json({ order });
};

// ===========================================================================================
//                                   GET CURRENT USER ORDERS
// ===========================================================================================

/**
 * @description Get orders for the currently logged-in user.
 * @route GET /api/v1/orders/showAllMyOrders
 * @access Private
 */
export const getCurrentUserOrders = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>
  >,
  res: Response<IGetCurrentUserOrdersResponse>
) => {
  const orders = await Order.find({ user: req.user?.userId });
  return res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
