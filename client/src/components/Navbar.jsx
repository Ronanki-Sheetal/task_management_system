import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, Plus, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import TaskModal from './TaskModal';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)' }}>

        {/* Left: Menu + Search */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all lg:hidden">
            <Menu size={20} />
          </button>
          <button onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all hidden lg:flex">
            <Menu size={18} />
          </button>

          {/* Search Bar Desktop */}
          <div className="relative hidden md:flex items-center">
            <Search size={16} className="absolute left-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks... (Enter)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-9 pr-4 py-2 text-sm rounded-xl w-64 transition-all focus:w-80"
              style={{
                background: 'rgba(30,41,59,0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F1F5F9',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all md:hidden">
            <Search size={18} />
          </button>

          {/* Create Task Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs px-3 py-2 md:px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Task</span>
          </motion.button>

          {/* Notifications (decorative) */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>

          {/* Avatar */}
          <button onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary/70 transition-all"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
            }
          </button>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-2 md:hidden"
            style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="input-field pl-9"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </>
  );
}
