import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
} from '../controllers/auth.controllers';
import { authenticateUser } from '../middlewares';

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').delete(authenticateUser, logoutUser);
router.route('/verify-email').post(verifyEmail);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password').post(resetPassword);

export default router;
