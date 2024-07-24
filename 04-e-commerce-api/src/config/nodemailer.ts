import nodemailer from 'nodemailer';
import config from './config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.gmailUsername,
    pass: config.gmailPassword,
  },
});

export default transporter;
