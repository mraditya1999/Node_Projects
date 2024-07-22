import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors';
import Task from '../models/task.models';
import { IAuthRequest } from '../types/request.types';

/**
 * ==========================================================================================
 *                                  GET ALL TASKS
 * ==========================================================================================
 *
 * This section handles retrieving all tasks created by the authenticated user.
 *
 * @description Get all tasks
 * @route GET /api/v1/tasks
 * @access Private
 */
export const getAllTasks = async (req: IAuthRequest, res: Response) => {
  const tasks = await Task.find({ createdBy: req.user?.userId }).sort(
    'createdAt'
  );
  return res.status(StatusCodes.OK).json({ tasks });
};

/**
 * ==========================================================================================
 *                                 GET SINGLE TASK
 * ==========================================================================================
 *
 * This section handles retrieving a single task by its ID, ensuring it belongs to the authenticated user.
 *
 * @description Get a single task
 * @route GET /api/v1/tasks/:id
 * @access Private
 */
export const getSingleTask = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: taskId } = req.params;
  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new NotFoundError(`No task with id : ${taskId}`);
  }
  return res.status(StatusCodes.OK).json({ task });
};

/**
 * ==========================================================================================
 *                                 CREATE TASK
 * ==========================================================================================
 *
 * This section handles creating a new task for the authenticated user.
 *
 * @description Create a new task
 * @route POST /api/v1/tasks
 * @access Private
 */
export const createTask = async (req: IAuthRequest, res: Response) => {
  req.body.createdBy = req.user?.userId;
  const task = await Task.create(req.body);
  return res.status(StatusCodes.CREATED).json({ task });
};

/**
 * ==========================================================================================
 *                                 UPDATE TASK
 * ==========================================================================================
 *
 * This section handles updating an existing task by its ID, ensuring it belongs to the authenticated user.
 *
 * @description Update an existing task
 * @route PATCH /api/v1/tasks/:id
 * @access Private
 */
export const updateTask = async (req: IAuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id: taskId } = req.params;
  const { task } = req.body;

  if (task === '') {
    throw new BadRequestError('Task cannot be empty');
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedTask) {
    throw new NotFoundError(`No task with id : ${taskId}`);
  }
  return res.status(StatusCodes.OK).json({ task });
};

/**
 * ==========================================================================================
 *                                 DELETE TASK
 * ==========================================================================================
 *
 * This section handles deleting an existing task by its ID, ensuring it belongs to the authenticated user.
 *
 * @description Delete an existing task
 * @route DELETE /api/v1/tasks/:id
 * @access Private
 */
export const deleteTask = async (req: IAuthRequest, res: Response) => {
  const { id: taskId } = req.params;
  const userId = req.user?.userId;
  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });
  if (!task) {
    throw new NotFoundError(`No task with id : ${taskId}`);
  }
  return res.status(StatusCodes.OK).json({ message: 'Deleted Successfully' });
};
