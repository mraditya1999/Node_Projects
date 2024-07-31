import { config, transporter } from '../config';

// ===========================================================================================
//                                  SEND EMAIL
// ===========================================================================================

/**
 * @description Sends an email using the configured transporter.
 * @param {string | string[]} to - The recipient email address(es).
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text body of the email.
 * @param {string} [html] - The HTML body of the email (optional).
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 * @throws {Error} - Throws an error if the email fails to send.
 */

interface ISendEmail {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: ISendEmail): Promise<void> => {
  const mailOptions = {
    from: {
      name: config.gmailName,
      address: config.gmailUsername,
    },
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
