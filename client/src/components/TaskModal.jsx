import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Flag, AlignLeft, Type, User } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import toast from 'react-hot-toast';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];
const CATEGORIES = ['General', 'Development', 'Design', 'Marketing', 'Research', 'Testing', 'DevOps', 'Management', 'Other'];

export default function TaskModal({ onClose, task = null }) {
  const { createTask, updateTask } = useTask();
  const isEdit = !!task;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    category: task?.category || 'General',
    tags: task?.tags?.join(', ') || '',
  });

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || null,
      };
      if (isEdit) await updateTask(task._id, payload);
      else await createTask(payload);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = { low: '#10B981', medium: '#F59E0B', high: '#EF4444', urgent: '#DC2626' };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="glass-card w-full max-w-lg mx-4 overflow-hidden"
        style={{ border: '1px solid rgba(6,182,212,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{isEdit ? 'Update task details' : 'Add a new task to your board'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Type size={12} className="inline mr-1" /> Title *
            </label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Enter task title..." className="input-field" required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <AlignLeft size={12} className="inline mr-1" /> Description
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the task..." rows={3}
              className="input-field resize-none" />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Flag size={12} className="inline mr-1" /> Priority
              </label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Status
              </label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Category & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Tag size={12} className="inline mr-1" /> Category
              </label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Calendar size={12} className="inline mr-1" /> Due Date
              </label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tags <span className="text-slate-600 normal-case font-normal">(comma separated)</span>
            </label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g. frontend, urgent, bug" className="input-field" />
          </div>

          {/* Priority indicator */}
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: `${priorityColors[form.priority]}15`, border: `1px solid ${priorityColors[form.priority]}30` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: priorityColors[form.priority] }} />
            <span className="text-xs font-medium" style={{ color: priorityColors[form.priority] }}>
              {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)} Priority Task
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {isEdit ? 'Update Task' : 'Create Task'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
