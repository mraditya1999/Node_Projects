import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/auth.controllers';

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

export default router;
