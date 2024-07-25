import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controllers';
import { getSingleProductReviews } from '../controllers/review.controllers';
import {
  authenticateUser,
  authorizePermissions,
  uploadSingleFile,
  validateImageFile,
} from '../middlewares';

router
  .route('/')
  .get(getAllProducts)
  .post(
    [
      authenticateUser,
      authorizePermissions('admin'),
      uploadSingleFile('productImage'),
      validateImageFile,
    ],
    createProduct
  );

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(
    [
      authenticateUser,
      authorizePermissions('admin'),
      uploadSingleFile('productImage'),
      validateImageFile,
    ],
    updateProduct
  )
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

export default router;
