import mongoose from "mongoose";
import { ITokenDocument } from "../types/model.types";

const TokenSchema = new mongoose.Schema<ITokenDocument>(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model<ITokenDocument>("Token", TokenSchema);

export default Token;
