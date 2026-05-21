const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    tags: [{ type: String, trim: true }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    attachments: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster querying
TaskSchema.index({ createdBy: 1, status: 1 });
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ title: 'text', description: 'text' });

// Auto-set completedAt when status changes to completed
TaskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed') {
      this.completedAt = new Date();
      this.progress = 100;
    } else if (this.status === 'in-progress' && this.progress === 0) {
      this.progress = 25;
    }
  }
  next();
});

// Virtual: isOverdue
TaskSchema.virtual('isOverdue').get(function () {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

TaskSchema.set('toJSON', { virtuals: true });
TaskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', TaskSchema);
