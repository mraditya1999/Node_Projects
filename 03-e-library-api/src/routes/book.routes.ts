import express from 'express';
const router = express.Router();
import { multiFileUpload } from '../middlewares/multer';
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/book.controllers';

const books = [
  { name: 'coverImage', maxCount: 1 },
  { name: 'file', maxCount: 1 },
];

router.route('/').get(getAllBooks).post(multiFileUpload(books), createBook);
router
  .route('/:id')
  .get(getBook)
  .patch(multiFileUpload(books), updateBook)
  .delete(deleteBook);

export default router;
