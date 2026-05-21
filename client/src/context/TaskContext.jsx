import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '', priority: '', category: '', search: '',
    sortBy: 'createdAt', order: 'desc', page: 1, limit: 10,
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });

  // Fetch tasks whenever filters change
  const fetchTasks = useCallback(async (customFilters) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = customFilters || filters;
      // Remove empty params
      const cleaned = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
      const { data } = await taskAPI.getAll(cleaned);
      setTasks(data.data);
      setPagination({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await taskAPI.getStats();
      setStats(data.data);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => { if (isAuthenticated) { fetchTasks(); fetchStats(); } }, [isAuthenticated, filters]);

  // Real-time socket events
  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = getSocket();
    if (!socket) return;

    socket.on('task:created', (task) => {
      setTasks(prev => [task, ...prev]);
      fetchStats();
      toast.success('📋 New task created!', { duration: 2000 });
    });

    socket.on('task:updated', (task) => {
      setTasks(prev => prev.map(t => t._id === task._id ? task : t));
      fetchStats();
    });

    socket.on('task:deleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t._id !== id));
      fetchStats();
      toast('🗑️ Task removed', { duration: 1500 });
    });

    socket.on('task:statusChanged', ({ id, status, task }) => {
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      fetchStats();
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('task:statusChanged');
    };
  }, [isAuthenticated, fetchStats]);

  // CRUD operations
  const createTask = useCallback(async (formData) => {
    const { data } = await taskAPI.create(formData);
    toast.success('Task created successfully! ✅');
    return data.data;
  }, []);

  const updateTask = useCallback(async (id, formData) => {
    const { data } = await taskAPI.update(id, formData);
    setTasks(prev => prev.map(t => t._id === id ? data.data : t));
    toast.success('Task updated successfully!');
    return data.data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskAPI.remove(id);
    setTasks(prev => prev.filter(t => t._id !== id));
    fetchStats();
    toast.success('Task deleted');
  }, [fetchStats]);

  const changeTaskStatus = useCallback(async (id, status) => {
    const { data } = await taskAPI.changeStatus(id, status);
    setTasks(prev => prev.map(t => t._id === id ? data.data : t));
    fetchStats();
    return data.data;
  }, [fetchStats]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ status: '', priority: '', category: '', search: '', sortBy: 'createdAt', order: 'desc', page: 1, limit: 10 });
  }, []);

  const value = {
    tasks, stats, loading, filters, pagination,
    fetchTasks, fetchStats,
    createTask, updateTask, deleteTask, changeTaskStatus,
    updateFilters, resetFilters,
    setTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
};

export default TaskContext;
