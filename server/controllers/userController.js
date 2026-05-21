const User = require('../models/User');
const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Attach task count per user
  const usersWithTaskCount = await Promise.all(
    users.map(async (user) => {
      const taskCount = await Task.countDocuments({ createdBy: user._id });
      const completedCount = await Task.countDocuments({ createdBy: user._id, status: 'completed' });
      return {
        ...user.toObject(),
        taskCount,
        completedCount,
        productivity: taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: usersWithTaskCount,
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new ErrorResponse('User not found', 404));

  const tasks = await Task.find({ createdBy: user._id }).sort({ createdAt: -1 }).limit(10);
  res.status(200).json({ success: true, data: { ...user.toObject(), tasks } });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  if (user._id.toString() === req.user.id) {
    return next(new ErrorResponse('Cannot delete your own account', 400));
  }

  await Task.deleteMany({ createdBy: user._id });
  await user.deleteOne();

  res.status(200).json({ success: true, message: 'User and their tasks deleted' });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) return next(new ErrorResponse('User not found', 404));
  res.status(200).json({ success: true, data: user });
});

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
});
