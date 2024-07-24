import { Request } from 'express';

export interface IPayload {
  userId: string | undefined;
  name: string | undefined;
}

export interface IAuthRequest extends Request {
  user?: IPayload | undefined;
}
