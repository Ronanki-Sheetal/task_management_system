const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/toggle-status', toggleUserStatus);

module.exports = router;
