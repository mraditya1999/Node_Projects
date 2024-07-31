import crypto from 'node:crypto';

export const createHashedString = (value: string) => {
  return crypto.createHash('md5').update(value).digest('hex');
};
