import express from 'express';
const router = express.Router();
import { sendEmailController } from '../controllers/email.controllers';

router.route('/').post(sendEmailController);

export default router;
