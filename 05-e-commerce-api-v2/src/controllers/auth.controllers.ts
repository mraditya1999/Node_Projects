import crypto from "node:crypto";
import { Request, Response } from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import { User } from "../models";
import { CustomError } from "../errors";
import {
  createTokenUser,
  attachCookiesToResponse,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHashedString,
} from "../utils";
import {
  IForgetPasswordRequest,
  IForgetPasswordResponse,
  ILoginUserRequest,
  ILogoutUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IUserResponse,
} from "../types/auth.types";
import { config } from "../config";
import Token from "../models/tokens.model";

// ==========================================================================================
//                                 REGISTER USER
// ==========================================================================================

// This section handles the registration of a new user.
// It checks for existing email addresses, creates a new user,
// assigns a role, and sends back a token and user information.
/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
// ==========================================================================================
export const registerUser = async (
  req: Request<
    Record<string, never>,
    IRegisterUserResponse,
    IRegisterUserRequest
  >,
  res: Response<IRegisterUserResponse>
) => {
  const { name, email, password } = req.body;

  const isEmailAlreadyExist = await User.findOne({ email });
  if (isEmailAlreadyExist) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // first user will be registered as admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // generate verification token
  const verificationToken = crypto.randomBytes(40).toString("hex");

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // Send Verification Email
  const origin = config.frontendUrl; //frontend Url
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "Success! Please check your email to verify account" });
};

// ==========================================================================================
//                                   VERIFY EMAIL
// ==========================================================================================
export const verifyEmail = async (req: Request, res: Response) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Email verification Failed!");
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Email verification Failed!");
  }

  user.isVerified = true;
  user.verified = new Date();
  user.verificationToken = "";

  await user.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: "Email verified Successfully...!" });
};

// ==========================================================================================
//                                   LOGIN USER
// ==========================================================================================

// This section manages user login functionality.
// It verifies user credentials, checks for the existence of the user,
// and responds with a token and user information upon successful login.
/**
 * @description Log in a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
// ==========================================================================================
export const loginUser = async (
  req: Request<Record<string, never>, IUserResponse, ILoginUserRequest>,
  res: Response<IUserResponse>
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email });
  console.log("user", user);
  if (!user) {
    throw new CustomError.UnauthenticatedError("User does not exist");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  console.log("isPasswordCorrect", isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }

  const tokenUser = createTokenUser(user);
  // Create Jwt token
  // const token = user.createJWT({ payload: tokenUser }); // user instance OR utils
  // const token = createJWT({ payload: tokenUser });

  // create refresh token
  let refreshToken = "";

  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });
  console.log("existingToken", existingToken);
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, tokenUser, refreshToken });
    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }

  // generate refresh token
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);

  // attach cookie in response
  attachCookiesToResponse({ res, tokenUser, refreshToken });
  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

// ===========================================================================================
//                                   LOGOUT USER
// ===========================================================================================

// This section handles user logout functionality.
// It invalidates the user's session by clearing the authentication cookie
// and responds with a success message.
/**
 * @description Log out a user
 * @route POST /api/v1/auth/logout
 * @access Public
 */
// ===========================================================================================
export const logoutUser = async (
  req: Request<
    Record<string, never>,
    ILogoutUserResponse,
    Record<string, never>
  >,
  res: Response<ILogoutUserResponse>
) => {
  const userId = req.user?.userId;
  await Token.findOneAndDelete({ user: userId });

  // Access Token
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  // Refresh Token
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ message: "User Logged out" });
};

// ==========================================================================================
//                                 FORGET PASSWORD
// ==========================================================================================

// This section handles the forget password functionality.
// It checks if the provided email exists, generates a password reset token,
// sends a reset password email, and saves the token and its expiration date.
/**
 * @description Send reset password email
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
// ==========================================================================================
export const forgetPassword = async (
  req: Request<
    Record<string, never>,
    IForgetPasswordResponse,
    IForgetPasswordRequest
  >,
  res: Response<IForgetPasswordResponse>
) => {
  const { email } = req.body;
  console.log(req.body);
  if (!email) {
    throw new CustomError.BadRequestError("Email is required");
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    // send Email
    const origin = config.frontendUrl;
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      passwordToken: passwordToken,
      origin: origin,
    });

    const tenMinutes = 1000 * 60 * 10; // 10 minutes
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHashedString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Please check your email for reset password link!" });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "Forget Password Failed!" });
};

// ==========================================================================================
//                                 RESET PASSWORD
// ==========================================================================================

// This section handles the reset password functionality.
// It validates the reset token, checks its expiration, updates the user's password,
// and clears the reset token and its expiration date.
/**
 * @description Reset user password
 * @route POST /api/v1/auth/reset-password
 * @access Public
 */
// ==========================================================================================
export const resetPassword = async (
  req: Request<
    Record<string, never>,
    IResetPasswordResponse,
    IResetPasswordRequest
  >,
  res: Response<IResetPasswordResponse>
) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("All fields are required");
  }

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHashedString(token) &&
      user.passwordTokenExpirationDate &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = "";
      user.passwordTokenExpirationDate = null;
      await user.save();
      return res
        .status(StatusCodes.OK)
        .json({ message: "Password Reset Successfully" });
    }
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "Reset Password Failed!" });
};
