import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../types/request.types';
import { BadRequestError, NotFoundError } from '../errors';
import Job from '../models/job.models';

export const getAllJobs = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const jobs = await Job.find({ createdBy: userId }).sort('createdAt');
  return res.status(StatusCodes.OK).json({ jobs });
};

export const getJob = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: jobId } = req.params;

  const job = await Job.findById({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  return res.status(StatusCodes.OK).json({ job });
};

export const createJob = async (req: IAuthRequest, res: Response) => {
  req.body.createdBy = req.user?.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

export const updateJob = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: jobId } = req.params;
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('All fields are required');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  return res.status(StatusCodes.OK).json({ updatedJob });
};

export const deleteJob = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: jobId } = req.params;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  return res.status(StatusCodes.OK).json({ message: 'Deleted Successfully' });
};
