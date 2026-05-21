import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, Calendar, Tag, ArrowRight } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { useTask } from '../context/TaskContext';
import { useState } from 'react';
import TaskModal from './TaskModal';
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

export default function TaskTable({ tasks }) {
  const { deleteTask, changeTaskStatus } = useTask();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState(null);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;
    try { await deleteTask(id); }
    catch { toast.error('Failed to delete task'); }
  };

  const handleStatusToggle = async (id, currentStatus, e) => {
    e.stopPropagation();
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try { await changeTaskStatus(id, nextStatus); }
    catch { toast.error('Failed to update status'); }
  };

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-12 text-center">Done</th>
                <th>Task Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Due Date</th>
                <th className="w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
                const pri = priorityConfig[task.priority] || priorityConfig.medium;
                const sta = statusConfig[task.status] || statusConfig.pending;

                return (
                  <tr key={task._id} onClick={() => navigate(`/tasks/${task._id}`)} className="cursor-pointer">
                    <td className="text-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleStatusToggle(task._id, task.status, e)}
                        className={`transition-colors rounded-full p-1 ${
                          task.status === 'completed' ? 'text-emerald-400' : 'text-slate-600 hover:text-emerald-400'
                        }`}
                      >
                        <CheckCircle size={18} />
                      </button>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-xs text-slate-500 line-clamp-1 max-w-md">{task.description}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${sta.class}`}>{sta.label}</span>
                    </td>
                    <td>
                      <span className={`badge ${pri.class}`}>
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: pri.dot }} />
                        {pri.label}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-semibold">
                        <Tag size={11} /> {task.category || 'General'}
                      </span>
                    </td>
                    <td>
                      {task.dueDate ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                          <Calendar size={11} />
                          {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          {isOverdue && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 ml-2">Overdue</span>}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                    <td onClick={e => e.stopPropagation()} className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                          title="Edit Task"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(task._id, e)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingTask && (
        <TaskModal task={editingTask} onClose={() => setEditingTask(null)} />
      )}
    </>
  );
}
