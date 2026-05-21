const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = asyncHandler(async (req, res, next) => {
  const userId = req.user.role === 'admin' ? null : mongoose.Types.ObjectId(req.user.id);

  const matchStage = userId
    ? { $or: [{ createdBy: userId }, { assignedTo: userId }] }
    : {};

  const [statusDist, priorityDist, categoryDist, totalUsers] = await Promise.all([
    Task.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: matchStage },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    req.user.role === 'admin' ? User.countDocuments() : Promise.resolve(null),
  ]);

  res.status(200).json({
    success: true,
    data: { statusDist, priorityDist, categoryDist, totalUsers },
  });
});

// @desc    Get tasks created per day (last 14 days)
// @route   GET /api/analytics/daily
// @access  Private
exports.getDailyStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.role === 'admin' ? null : mongoose.Types.ObjectId(req.user.id);

  const days = parseInt(req.query.days || 14, 10);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const matchStage = userId
    ? { createdAt: { $gte: since }, $or: [{ createdBy: userId }, { assignedTo: userId }] }
    : { createdAt: { $gte: since } };

  const dailyCreated = await Task.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        created: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill missing days with 0
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const found = dailyCreated.find(x => x._id === dateStr);
    result.push({ date: dateStr, created: found?.created || 0, completed: found?.completed || 0 });
  }

  res.status(200).json({ success: true, data: result });
});

// @desc    Get completion rate over time
// @route   GET /api/analytics/completion
// @access  Private
exports.getCompletionRate = asyncHandler(async (req, res, next) => {
  const userId = req.user.role === 'admin' ? null : mongoose.Types.ObjectId(req.user.id);
  const days = parseInt(req.query.days || 7, 10);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const matchStage = userId
    ? { createdAt: { $gte: since }, $or: [{ createdBy: userId }, { assignedTo: userId }] }
    : { createdAt: { $gte: since } };

  const weekly = await Task.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const days_map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = weekly.map(w => ({
    day: days_map[w._id - 1],
    total: w.total,
    completed: w.completed,
    rate: w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0,
  }));

  res.status(200).json({ success: true, data: result });
});

// @desc    Get user productivity stats (Admin)
// @route   GET /api/analytics/productivity
// @access  Private/Admin
exports.getUserProductivity = asyncHandler(async (req, res, next) => {
  const productivity = await Task.aggregate([
    {
      $group: {
        _id: '$createdBy',
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
      },
    },
    {
      $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' },
    },
    { $unwind: '$user' },
    {
      $project: {
        name: '$user.name',
        email: '$user.email',
        avatar: '$user.avatar',
        total: 1,
        completed: 1,
        pending: 1,
        inProgress: 1,
        productivity: {
          $cond: [{ $gt: ['$total', 0] }, { $multiply: [{ $divide: ['$completed', '$total'] }, 100] }, 0],
        },
      },
    },
    { $sort: { productivity: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({ success: true, data: productivity });
});
