import { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

interface ICustomError {
  statusCode: number;
  message: string;
}

const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  const customError: ICustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later',
  };

  console.log(err);

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item) => (item as MongooseError.ValidatorError).message)
      .join(',');
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.name === 'CastError') {
    customError.message = `No item found with id: ${
      (err as MongooseError.CastError).value
    }`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.message });
};

export default errorHandlerMiddleware;
