import { Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../models';
import { CustomError } from '../errors';
import {
  uploadOnCloudinary,
  getPublicIdFromUrl,
  deleteFromCloudinary,
} from '../utils';
import {
  ICreateProductRequest,
  ICreateProductResponse,
  IGetAllProductsResponse,
  IDeleteProductResponse,
  IGetSingleProductResponse,
  IQuery,
  IQueryObject,
  IUpdateProductRequest,
  IUpdateProductResponse,
} from '../types/product.types';

/**
 * @description Get all products with optional query filters, sorting, and pagination
 * @route GET /api/v1/products
 * @access Public
 */
export const getAllProducts = async (
  req: Request<
    Record<string, never>,
    IGetAllProductsResponse,
    Record<string, never>,
    IQuery
  >,
  res: Response<IGetAllProductsResponse>
) => {
  const { featured, company, name, sort, fields, numericFilters } =
    req.query;

  const queryObject: IQueryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (numericFilters && typeof numericFilters === 'string') {
    const operatorsMap: { [key: string]: string } = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    const filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorsMap[match as keyof typeof operatorsMap]}-`
    );
    const options = ['price', 'rating'];

    filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field as 'price' | 'rating'] = {
          [operator]: Number(value),
        };
      }
    });
  }

  let result = Product.find(queryObject);
  if (sort && typeof sort === 'string') {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields && typeof fields === 'string') {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 10;
  const skip: number = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  return res.status(StatusCodes.OK).json({ products, count: products.length });
};

/**
 * @description Get a single product by ID
 * @route GET /api/v1/products/:id
 * @access Public
 */
export const getSingleProduct = async (
  req: Request<
    { id: string },
    IGetSingleProductResponse,
    Record<string, never>
  >,
  res: Response<IGetSingleProductResponse>
) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  return res.status(StatusCodes.OK).json({ product });
};

/**
 * @description Create a new product
 * @route POST /api/v1/products
 * @access Private
 */
export const createProduct = async (
  req: Request<
    Record<string, never>,
    ICreateProductResponse,
    ICreateProductRequest
  >,
  res: Response<ICreateProductResponse>
) => {
  if (!req.file) {
    throw new CustomError.BadRequestError('Product image is required');
  }

  // Upload image to Cloudinary
  const localFilePath = req.file.path;
  const folderNameOnCloudinary = 'products';
  const imageUrl = await uploadOnCloudinary(
    localFilePath,
    folderNameOnCloudinary
  );

  req.body.user = req.user?.userId;
  const product = await Product.create({
    ...req.body,
    image: imageUrl,
    user: req.user?.userId,
  });
  return res.status(StatusCodes.CREATED).json({ product });
};

/**
 * @description Update an existing product by ID
 * @route PATCH /api/v1/products/:id
 * @access Private
 */
export const updateProduct = async (
  req: Request<{ id: string }, IUpdateProductResponse, IUpdateProductRequest>,
  res: Response
) => {
  const { id: productId } = req.params;

  // Find the existing product
  const existingProduct = await Product.findOne({ _id: productId });
  if (!existingProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  // Prepare update data
  const updateData = { ...req.body };

  // Check if a new image file is provided
  if (req.file) {
    const localFilePath = req.file.path;
    const folderNameOnCloudinary = 'products';

    // Get the public ID from the product's image URL
    const publicId = getPublicIdFromUrl(existingProduct.image);
    // Delete the existing image from Cloudinary
    await deleteFromCloudinary(publicId);

    // upload new image to Cloudinary
    const imageUrl = await uploadOnCloudinary(
      localFilePath,
      folderNameOnCloudinary
    );
    updateData.image = imageUrl;
  }

  // Update the product in the database
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(StatusCodes.OK).json({ product });
};

/**
 * @description Delete a product by ID
 * @route DELETE /api/v1/products/:id
 * @access Private
 */
export const deleteProduct = async (
  req: Request<{ id: string }, IDeleteProductResponse, Record<string, never>>,
  res: Response<IDeleteProductResponse>
) => {
  const { id: productId } = req.params;

  // Find the existing product
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  // Get the public ID from the product's image URL
  const publicId = getPublicIdFromUrl(product.image);
  // Delete the image from Cloudinary
  await deleteFromCloudinary(publicId);

  // Delete the product from the database
  await product.deleteOne();

  return res
    .status(StatusCodes.OK)
    .json({ message: 'Product Deleted Successfully' });
};
