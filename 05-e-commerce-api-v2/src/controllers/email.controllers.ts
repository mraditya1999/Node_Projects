import { Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { sendEmail } from '../utils/sendEmail';
import {
  ISendEmailRequest,
  ISendEmailResponse,
} from '../types/send-email.types';

export const sendEmailController = async (
  req: Request<Record<string, never>, ISendEmailResponse, ISendEmailRequest>,
  res: Response<ISendEmailResponse>
) => {
  const { to, subject, text } = req.body;

  await sendEmail({ to, subject, html: '',text });
  res.status(StatusCodes.OK).json({ message: 'Email sent successfully' });
};
