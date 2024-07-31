import express from 'express';
const router = express.Router();
import { authenticateUser, authorizePermissions } from '../middlewares';
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from '../controllers/user.controllers';

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllUsers)
  .post(authenticateUser, authorizePermissions('admin'), deleteUser);

router.route('/currentUser').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router
  .route('/:id')
  .get(authenticateUser, getSingleUser)
  .delete(authenticateUser, authorizePermissions('admin'), deleteUser);

export default router;
