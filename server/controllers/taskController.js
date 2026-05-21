const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tasks (with filters, search, sort, pagination)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  const {
    status,
    priority,
    category,
    search,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
    dueDate,
  } = req.query;

  // Build query
  let query = {};

  // Non-admin users only see their tasks
  if (req.user.role !== 'admin') {
    query.$or = [
      { createdBy: req.user.id },
      { assignedTo: req.user.id },
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = { $regex: category, $options: 'i' };
  if (dueDate) {
    const date = new Date(dueDate);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    query.dueDate = { $gte: date, $lt: nextDay };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  // Sorting
  const sortOrder = order === 'asc' ? 1 : -1;
  let sortObj = {};
  switch (sortBy) {
    case 'dueDate': sortObj = { dueDate: sortOrder }; break;
    case 'priority':
      sortObj = { priority: sortOrder }; break;
    case 'title': sortObj = { title: sortOrder }; break;
    default: sortObj = { createdAt: sortOrder };
  }

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Task.countDocuments(query);
  const tasks = await Task.find(query)
    .populate('createdBy', 'name email avatar')
    .populate('assignedTo', 'name email avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatar')
    .populate('assignedTo', 'name email avatar')
    .populate('comments.user', 'name email avatar');

  if (!task) return next(new ErrorResponse('Task not found', 404));

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    task.createdBy._id.toString() !== req.user.id &&
    (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)
  ) {
    return next(new ErrorResponse('Not authorized to view this task', 403));
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const task = await Task.create(req.body);
  const populated = await Task.findById(task._id)
    .populate('createdBy', 'name email avatar')
    .populate('assignedTo', 'name email avatar');

  // Emit socket event
  const io = req.app.get('io');
  if (io) io.emit('task:created', populated);

  res.status(201).json({ success: true, data: populated });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse('Task not found', 404));

  if (
    req.user.role !== 'admin' &&
    task.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to update this task', 403));
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('createdBy', 'name email avatar')
    .populate('assignedTo', 'name email avatar');

  // Emit socket event
  const io = req.app.get('io');
  if (io) io.emit('task:updated', task);

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse('Task not found', 404));

  if (
    req.user.role !== 'admin' &&
    task.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to delete this task', 403));
  }

  await task.deleteOne();

  // Emit socket event
  const io = req.app.get('io');
  if (io) io.emit('task:deleted', { id: req.params.id });

  res.status(200).json({ success: true, data: {}, message: 'Task deleted' });
});

// @desc    Change task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.changeStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  let task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse('Task not found', 404));

  task.status = status;
  await task.save();

  const populated = await Task.findById(task._id)
    .populate('createdBy', 'name email avatar')
    .populate('assignedTo', 'name email avatar');

  const io = req.app.get('io');
  if (io) io.emit('task:statusChanged', { id: req.params.id, status, task: populated });

  res.status(200).json({ success: true, data: populated });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse('Task not found', 404));

  task.comments.unshift({ user: req.user.id, text: req.body.text });
  await task.save();

  const populated = await Task.findById(task._id).populate('comments.user', 'name avatar');
  res.status(200).json({ success: true, data: populated.comments });
});

// @desc    Get task stats for dashboard
// @route   GET /api/tasks/stats
// @access  Private
exports.getTaskStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  const matchQuery = isAdmin
    ? {}
    : { $or: [{ createdBy: userId }, { assignedTo: userId }] };

  const [statusStats, priorityStats, categoryStats, recentTasks] = await Promise.all([
    Task.aggregate([
      { $match: isAdmin ? {} : { $or: [{ createdBy: require('mongoose').Types.ObjectId(userId) }, { assignedTo: require('mongoose').Types.ObjectId(userId) }] } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: isAdmin ? {} : { $or: [{ createdBy: require('mongoose').Types.ObjectId(userId) }, { assignedTo: require('mongoose').Types.ObjectId(userId) }] } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: isAdmin ? {} : { $or: [{ createdBy: require('mongoose').Types.ObjectId(userId) }, { assignedTo: require('mongoose').Types.ObjectId(userId) }] } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Task.find(isAdmin ? {} : matchQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name avatar'),
  ]);

  // Build summary
  const statusMap = {};
  statusStats.forEach(s => { statusMap[s._id] = s.count; });

  const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
  const completed = statusMap['completed'] || 0;
  const pending = statusMap['pending'] || 0;
  const inProgress = statusMap['in-progress'] || 0;

  // Overdue tasks
  const overdue = await Task.countDocuments({
    ...(isAdmin ? {} : { $or: [{ createdBy: userId }, { assignedTo: userId }] }),
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled'] },
  });

  const productivityScore = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      productivityScore,
      priorityStats,
      categoryStats,
      recentTasks,
    },
  });
});
