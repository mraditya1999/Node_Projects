import express from 'express';
const router = express.Router();
import { authenticateUser } from '../middlewares';
import {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/review.controllers';

router.route('/').get(getAllReviews).post(authenticateUser, createReview);
router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
