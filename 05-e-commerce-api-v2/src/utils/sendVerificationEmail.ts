import { sendEmail } from './sendEmail';

interface ISendVerificationEmail {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
}

export const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}: ISendVerificationEmail) => {
  const verifyEmailUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link : <a href="${verifyEmailUrl}">Verify Email</a></p>`;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4>Hello, ${name}</h4>
    ${message}
    `,
  });
};
