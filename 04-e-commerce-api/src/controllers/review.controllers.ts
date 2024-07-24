import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Review from '../models/reviews.model';
import { CustomError } from '../errors';
import { checkPermissions, IAuthRequest } from '../utils';
import { Product } from '../models';

// ===========================================================================================
//                                    GET ALL REVIEWS
// ===========================================================================================

// This endpoint retrieves all reviews from the database.
// Each review includes information about the associated product and user.
// On success, it returns the list of reviews and the total count.
/**
 * @description Get all reviews
 * @route GET /api/v1/reviews
 * @access Public
 */
// ===========================================================================================
export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name company price',
    })
    .populate({
      path: 'user',
      select: 'name',
    });
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// ===========================================================================================
//                                  GET SINGLE REVIEW
// ===========================================================================================

// This endpoint retrieves a single review by its ID.
// It includes information about the associated product and user.
// If the review is not found, a NotFoundError is thrown.
// On success, it returns the review details.
/**
 * @description Get a single review by ID
 * @route GET /api/v1/reviews/:id
 * @access Public
 */
// ===========================================================================================
export const getSingleReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId })
    .populate({
      path: 'product',
      select: 'name company price',
    })
    .populate({
      path: 'user',
      select: 'name',
    });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${reviewId}`
    );
  }

  return res.status(StatusCodes.OK).json({ review });
};

// ===========================================================================================
//                          GET REVIEWS FOR SINGLE PRODUCT
// ===========================================================================================

// This endpoint retrieves all reviews for a specific product by its ID.
// On success, it returns the list of reviews for the product and the total count.
/**
 * @description Get all reviews for a single product
 * @route GET /api/v1/products/:id/reviews
 * @access Public
 */
// ===========================================================================================
export const getSingleProductReviews = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// ===========================================================================================
//                                   CREATE REVIEW
// ===========================================================================================

// This endpoint creates a new review for a product.
// It checks if the product exists and if the user has already submitted a review for the product.
// If the product doesn't exist or the user has already submitted a review, appropriate errors are thrown.
// On success, it returns the newly created review.
/**
 * @description Create a new review for a product
 * @route POST /api/v1/reviews
 * @access Private
 */
// ===========================================================================================

export const createReview = async (req: IAuthRequest, res: Response) => {
  const { product: productId } = req.body;
  const userId = req.user?.userId;

  const isProductExist = await Product.findOne({ _id: productId });
  if (!isProductExist) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`);
  }

  const hasAlreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (hasAlreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this product'
    );
  }

  req.body.user = req.user?.userId;
  const review = await Review.create(req.body);
  return res.status(StatusCodes.CREATED).json({ review });
};

// ===========================================================================================
//                                   UPDATE REVIEW
// ===========================================================================================

// This endpoint updates an existing review by its ID.
// It checks if the review exists and if the user has permission to update it.
// If the review doesn't exist or the user lacks permission, appropriate errors are thrown.
// On success, it returns the updated review.
/**
 * @description Update an existing review
 * @route PATCH /api/v1/reviews/:id
 * @access Private
 */
// ===========================================================================================
export const updateReview = async (req: IAuthRequest, res: Response) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${reviewId}`
    );
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  return res.status(StatusCodes.OK).json({ review });
};

// ===========================================================================================
//                                   DELETE REVIEW
// ===========================================================================================

// This endpoint deletes an existing review by its ID.
// It checks if the review exists and if the user has permission to delete it.
// If the review doesn't exist or the user lacks permission, appropriate errors are thrown.
// On success, it returns a success message.
/**
 * @description Delete an existing review
 * @route DELETE /api/v1/reviews/:id
 * @access Private
 */
// ===========================================================================================
export const deleteReview = async (req: IAuthRequest, res: Response) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id : ${reviewId}`
    );
  }

  checkPermissions(req.user, review.user);
  await Review.deleteOne({ _id: reviewId });

  return res
    .status(StatusCodes.OK)
    .json({ message: 'Review removed successfully!' });
};
