const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  changeStatus,
  addComment,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.put('/:id/status', changeStatus);
router.post('/:id/comments', addComment);

module.exports = router;
