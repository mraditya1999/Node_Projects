import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { config } from '../config';
import { IUserDocument } from '../types/models.types';

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'please provide name'],
      minlength: [3, 'Name must be between 3 and 50 characters'],
      maxlength: [50, 'Name must be between 3 and 50 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'please provide email'],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
      //  OR
      // match: [
      //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   'Please provide a valid email',
      // ],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'please provide password'],
      minlength: [6, 'Password length must be between 6 and 15'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// mongoose middleware
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password
UserSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// Instance methods
UserSchema.methods.createJWT = function (): string {
  const payload = {
    userId: this._id.toString(),
    name: this.name,
    role: this.role,
  };
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtLifetime,
  });
};

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
