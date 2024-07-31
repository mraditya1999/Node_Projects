import { sendEmail } from './sendEmail';

interface ISendResetPasswordEmail {
  name: string;
  email: string;
  passwordToken: string;
  origin: string;
}

export const sendResetPasswordEmail = async ({
  name,
  email,
  passwordToken,
  origin,
}: ISendResetPasswordEmail) => {
  const resetPasswordUrl = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : <a href="${resetPasswordUrl}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: 'Reset Password',
    html: `<h4>Hello, ${name}</h4>
    ${message}
    `,
  });
};
