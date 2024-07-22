import express from 'express';
const router = express.Router();
import { loginUser, registerUser } from './auth.controllers';

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

export default router;
