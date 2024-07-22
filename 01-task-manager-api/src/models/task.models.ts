import mongoose from 'mongoose';
import { IUser } from '../types/user.types';

export interface ITask {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: IUser;
  title: string;
  isCompleted: boolean;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title must be provided'],
      trim: true,
      maxLength: [20, 'Title cannot be more than 20 characters'],
    },
    isCompleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
