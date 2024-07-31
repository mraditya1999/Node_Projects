import mongoose from 'mongoose';

const connectToDB = (url: string) => {
  return mongoose.connect(url);
};

export default connectToDB;
