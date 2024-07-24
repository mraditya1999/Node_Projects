import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendEmail } from '../utils/sendEmail';

export const sendEmailController = async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  await sendEmail(to, subject, text);
  res.status(StatusCodes.OK).json({ message: 'Email sent successfully' });
};
