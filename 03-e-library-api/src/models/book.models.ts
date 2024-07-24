import mongoose from 'mongoose';
import { IUser } from '../types/user.types';

export interface IBook {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  createdBy: IUser;
  genre: string;
  coverImage: string;
  file: string;
}

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Title must be provided'],
      trim: true,
      maxLength: [20, 'Title cannot be more than 20 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    genre: {
      type: String,
      required: [true, 'Genre must be provided'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image path must be provided'],
    },
    file: {
      type: String,
      required: [true, 'File path must be provided'],
    },
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>('Book', bookSchema);
export default Book;
