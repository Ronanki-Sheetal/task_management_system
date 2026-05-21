import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutGrid, List, Plus, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import SearchBar from '../../components/SearchBar';
import FilterDropdown from '../../components/FilterDropdown';
import TaskCard from '../../components/TaskCard';
import TaskTable from '../../components/TaskTable';
import Loader from '../../components/Loader';
import TaskModal from '../../components/TaskModal';
import { motion } from 'framer-motion';

export default function TasksPage() {
  const { tasks, loading, filters, pagination, updateFilters, fetchTasks } = useTask();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();

  // Parse query params (like search from navbar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchVal = params.get('search');
    if (searchVal !== null) {
      updateFilters({ search: searchVal });
    }
  }, [location.search, updateFilters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      updateFilters({ page: newPage });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white flex items-center gap-2">
            <CheckSquare className="text-primary" size={28} /> My Tasks
          </h1>
          <p className="text-slate-400 mt-1">Manage and track your day-to-day deliverables.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus size={16} /> New Task
        </motion.button>
      </div>

      {/* Toolbar: Search, Filters, View toggle */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="w-full md:w-72">
          <SearchBar />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterDropdown />
          <div className="h-8 w-px bg-white/5 hidden sm:block" />
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-slate-200'}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks listing */}
      {loading ? (
        <Loader text="Fetching your tasks..." />
      ) : tasks.length === 0 ? (
        <div className="glass-card py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <CheckSquare size={32} />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-lg font-bold text-white">No tasks found</h3>
            <p className="text-slate-500 text-sm mt-1">Try resetting filters or create a new task to get started.</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task, idx) => (
            <TaskCard key={task._id} task={task} index={idx} />
          ))}
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-xl border border-white/5 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-slate-400">
            Page <strong className="text-white">{pagination.currentPage}</strong> of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 rounded-xl border border-white/5 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showCreateModal && (
        <TaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
