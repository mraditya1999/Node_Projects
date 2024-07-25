import nodemailer from 'nodemailer';
import config from './config';

const transporter = nodemailer.createTransport({
  service: config.mailService,
  host: config.mailHost,
  port: config.mailPort,
  secure: false,
  auth: {
    user: config.gmailUsername,
    pass: config.gmailPassword,
  },
});

export default transporter;
