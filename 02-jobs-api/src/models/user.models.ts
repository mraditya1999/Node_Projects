import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.types';
import { config } from '../config/config';

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'please provide name'],
    minlength: [3, 'Name must be between 3 and 20 characters'],
    maxlength: [20, 'Name must be between 3 and 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minlength: [6, 'Password length must be between 6 and 15'],
  },
});

// mongoose middleware
UserSchema.pre('save', async function () {
  // hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance methods
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, config.jwtSecret, {
    expiresIn: config.jwtLifetime,
  });
};

UserSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
