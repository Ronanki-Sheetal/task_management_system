import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Tag, MoreVertical, Edit2, Trash2, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import TaskModal from './TaskModal';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

const priorityConfig = {
  low:    { label: 'Low',    class: 'badge-low',    dot: '#10B981' },
  medium: { label: 'Medium', class: 'badge-medium', dot: '#F59E0B' },
  high:   { label: 'High',   class: 'badge-high',   dot: '#EF4444' },
  urgent: { label: 'Urgent', class: 'badge-urgent', dot: '#DC2626' },
};

const statusConfig = {
  'pending':     { label: 'Pending',     class: 'badge-pending' },
  'in-progress': { label: 'In Progress', class: 'badge-in-progress' },
  'completed':   { label: 'Completed',   class: 'badge-completed' },
  'cancelled':   { label: 'Cancelled',   class: 'badge-cancelled' },
};

export default function TaskCard({ task, index = 0, compact = false }) {
  const { deleteTask, changeTaskStatus } = useTask();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
  const pri = priorityConfig[task.priority] || priorityConfig.medium;
  const sta = statusConfig[task.status] || statusConfig.pending;

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    setDeleting(true);
    try { await deleteTask(task._id); }
    catch { toast.error('Failed to delete task'); setDeleting(false); }
  };

  const handleComplete = async (e) => {
    e.stopPropagation();
    if (task.status === 'completed') return;
    try { await changeTaskStatus(task._id, 'completed'); }
    catch { toast.error('Failed to update status'); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="glass-card glass-card-hover relative group cursor-pointer"
        onClick={() => navigate(`/tasks/${task._id}`)}
        style={{ borderLeft: `3px solid ${pri.dot}` }}
      >
        <div className="p-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`badge ${sta.class}`}>{sta.label}</span>
                <span className={`badge ${pri.class}`}>
                  <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ background: pri.dot }} />
                  {pri.label}
                </span>
                {isOverdue && (
                  <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                    Overdue
                  </span>
                )}
              </div>
              <h3 className={`font-semibold text-sm leading-snug ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                {task.title}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleComplete}
                className={`p-1.5 rounded-lg transition-all ${task.status === 'completed' ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10'}`}
                title="Mark complete"
              >
                <CheckCircle size={15} />
              </motion.button>
              <button onClick={e => { e.stopPropagation(); setShowEdit(true); }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all">
                <Edit2 size={15} />
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Description */}
          {!compact && task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {task.category && (
                <span className="flex items-center gap-1">
                  <Tag size={11} /> {task.category}
                </span>
              )}
            </div>
            {task.dueDate && (
              <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                <Calendar size={11} />
                {format(new Date(task.dueDate), 'MMM dd')}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {task.status === 'in-progress' && (
            <div className="mt-3">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress || 25}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {showEdit && <TaskModal task={task} onClose={() => setShowEdit(false)} />}
    </>
  );
}
