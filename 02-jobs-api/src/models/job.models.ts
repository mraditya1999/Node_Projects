import mongoose from 'mongoose';
import { IUser } from '../types/user.types';

export interface IJob {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: IUser;
  company: string;
  position: string;
  status: 'interview' | 'decline' | 'pending';
}

const JobSchema = new mongoose.Schema<IJob>(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model<IJob>('Job', JobSchema);
export default Job;
