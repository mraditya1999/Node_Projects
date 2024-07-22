import express from 'express';
const router = express.Router();
import {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getSingleTask).patch(updateTask).delete(deleteTask);

export default router;
