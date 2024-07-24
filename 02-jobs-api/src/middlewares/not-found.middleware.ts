import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: 'Route does not exist' });
};

export default notFound;
