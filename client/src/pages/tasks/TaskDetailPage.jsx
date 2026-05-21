import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Tag, Flag, User, Clock, ArrowLeft,
  Edit2, Trash2, Send, MessageSquare, CheckSquare, ChevronRight
} from 'lucide-react';
import { taskAPI } from '../../services/api';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import TaskModal from '../../components/TaskModal';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const priorityConfig = {
  low:    { label: 'Low',    class: 'badge-low',    dot: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  medium: { label: 'Medium', class: 'badge-medium', dot: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  high:   { label: 'High',   class: 'badge-high',   dot: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  urgent: { label: 'Urgent', class: 'badge-urgent', dot: '#DC2626', bg: 'rgba(220,38,38,0.25)' },
};

const statusConfig = {
  'pending':     { label: 'Pending',     class: 'badge-pending' },
  'in-progress': { label: 'In Progress', class: 'badge-in-progress' },
  'completed':   { label: 'Completed',   class: 'badge-completed' },
  'cancelled':   { label: 'Cancelled',   class: 'badge-cancelled' },
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { deleteTask, changeTaskStatus } = useTask();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const { data } = await taskAPI.getOne(id);
      setTask(data.data);
    } catch (err) {
      toast.error('Failed to load task details');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await changeTaskStatus(task._id, newStatus);
      setTask(prev => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to change status');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommenting(true);
    try {
      const { data } = await taskAPI.addComment(task._id, commentText.trim());
      setTask(prev => ({ ...prev, comments: data.data }));
      setCommentText('');
      toast.success('Comment posted! 💬');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task permanently?')) return;
    try {
      await deleteTask(task._id);
      navigate('/tasks');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return <Loader text="Loading task details..." />;
  if (!task) return null;

  const pri = priorityConfig[task.priority] || priorityConfig.medium;
  const sta = statusConfig[task.status] || statusConfig.pending;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={16} /> Back to Tasks
        </Link>

        {/* Edit / Delete only if owner or admin */}
        {(currentUser?.role === 'admin' || task.createdBy?._id === currentUser?.id || task.createdBy === currentUser?.id) && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-ghost text-xs px-3 py-2 flex items-center gap-1"
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger text-xs px-3 py-2 flex items-center gap-1"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details (Col Span 2) */}
        <div className="md:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${sta.class}`}>{sta.label}</span>
              <span className="badge" style={{ backgroundColor: pri.bg, color: pri.dot }}>
                <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: pri.dot }} />
                {pri.label} Priority
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{task.title}</h1>

            {task.description ? (
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-white/5">
                  {task.description}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">No description provided for this task.</p>
            )}

            {/* Tags */}
            {task.tags?.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" /> Comments ({task.comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {currentUser?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="input-field pr-12"
                  disabled={commenting}
                />
                <button
                  type="submit"
                  disabled={commenting || !commentText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary-light disabled:opacity-40 transition-colors"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4 pt-2">
              {task.comments?.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 text-sm">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}
                    >
                      {comment.user?.avatar ? (
                        <img src={comment.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{comment.user?.name?.[0]?.toUpperCase() || '?'}</span>
                      )}
                    </div>
                    <div className="flex-1 bg-slate-900/30 p-3 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-200">{comment.user?.name || 'Unknown User'}</span>
                        <span className="text-[10px] text-slate-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs text-center py-4">No comments yet. Start the conversation!</p>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel (Col Span 1) */}
        <div className="space-y-6">
          {/* Status Controls */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">Status Settings</h2>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Update Status</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input-field py-2"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Meta Information Card */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">Details</h2>

            <div className="space-y-3.5 pt-2">
              {/* Due Date */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar size={13} /> Due Date
                </span>
                <span className="font-medium text-slate-200">
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No deadline'}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Tag size={13} /> Category
                </span>
                <span className="font-medium text-slate-200">{task.category || 'General'}</span>
              </div>

              {/* Created By */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User size={13} /> Created By
                </span>
                <span className="font-medium text-slate-200 flex items-center gap-1">
                  {task.createdBy?.name || 'System'}
                </span>
              </div>

              {/* Created At */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock size={13} /> Created At
                </span>
                <span className="font-medium text-slate-200">
                  {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <TaskModal
          task={task}
          onClose={() => {
            setShowEditModal(false);
            fetchTaskDetails();
          }}
        />
      )}
    </div>
  );
}
