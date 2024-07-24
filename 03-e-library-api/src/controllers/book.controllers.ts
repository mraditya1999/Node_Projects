import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import { IAuthRequest } from '../types/request.types';
import {
  deleteFromCloudinary,
  getPublicIdFromUrl,
  uploadOnCloudinary,
  validateImageFile,
  validatePdfFile,
} from '../utils/utils';
import Book from '../models/book.models';

export const getAllBooks = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const books = await Book.find({ createdBy: userId });
  return res.status(StatusCodes.OK).json({ books });
};

export const getBook = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: bookId } = req.params;
  const book = await Book.findOne({ _id: bookId, createdBy: userId });

  if (!book) {
    throw new NotFoundError(`No book with id: ${bookId}`);
  }

  return res.status(StatusCodes.OK).json({ book });
};

export const createBook = async (req: IAuthRequest, res: Response) => {
  const files = req.files as { [filename: string]: Express.Multer.File[] };
  if (!files || !files.coverImage || !files.file) {
    throw new BadRequestError('Please upload both cover image and file');
  }

  validateImageFile(files.coverImage[0]);
  validatePdfFile(files.file[0]);

  const BOOK_COVER_NAME_ON_CLOUDINARY = 'book-covers';
  const BOOK_FOLDER_NAME_ON_CLOUDINARY = 'book-pdfs';

  const bookCoverUploadResult = await uploadOnCloudinary(
    files.coverImage[0],
    BOOK_COVER_NAME_ON_CLOUDINARY
  );
  const bookUploadResult = await uploadOnCloudinary(
    files.file[0],
    BOOK_FOLDER_NAME_ON_CLOUDINARY
  );

  req.body.coverImage = bookCoverUploadResult;
  req.body.file = bookUploadResult;
  req.body.createdBy = req.user?.userId;

  const book = await Book.create(req.body);
  return res.status(StatusCodes.CREATED).json({ book });
};

export const updateBook = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: bookId } = req.params;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const book = await Book.findOne({ _id: bookId, createdBy: userId });

  if (!book) {
    throw new NotFoundError(`No book found with id: ${bookId}`);
  }

  if (files && files.coverImage) {
    validateImageFile(files.coverImage[0]);
    const BOOK_COVER_NAME_ON_CLOUDINARY = 'book-covers';

    // Delete old cover image from Cloudinary
    const coverImagePublicId = getPublicIdFromUrl(book.coverImage);
    await deleteFromCloudinary(coverImagePublicId);

    // Upload new cover image to Cloudinary
    const bookCoverUpdateResult = await uploadOnCloudinary(
      files.coverImage[0],
      BOOK_COVER_NAME_ON_CLOUDINARY
    );

    req.body.coverImage = bookCoverUpdateResult;
  }

  if (files && files.file) {
    validatePdfFile(files.file[0]);
    const BOOK_FOLDER_NAME_ON_CLOUDINARY = 'book-pdfs';

    // Delete old file from Cloudinary
    const filePublicId = getPublicIdFromUrl(book.file);
    await deleteFromCloudinary(filePublicId);

    // Upload new file to Cloudinary
    const bookFileUpdateResult = await uploadOnCloudinary(
      files.file[0],
      BOOK_FOLDER_NAME_ON_CLOUDINARY
    );

    req.body.file = bookFileUpdateResult;
  }

  const updatedBook = await Book.findOneAndUpdate(
    { _id: bookId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBook) {
    throw new BadRequestError(
      'Book not found or you do not have permission to update this book'
    );
  }
  return res.status(StatusCodes.OK).json({ updatedBook });
};

export const deleteBook = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: bookId } = req.params;

  const book = await Book.findOne({ _id: bookId, createdBy: userId });
  if (!book) {
    throw new NotFoundError(`No book with id : ${bookId}`);
  }

  const coverImagePublicId = getPublicIdFromUrl(book.coverImage);
  await deleteFromCloudinary(coverImagePublicId);

  const filePublicId = getPublicIdFromUrl(book.file);
  await deleteFromCloudinary(filePublicId);

  await Book.deleteOne({ _id: bookId });
  return res.status(StatusCodes.OK).json({ message: 'Deleted Successfully!' });
};
