import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Kanban, BarChart3,
  Users, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
  { to: '/kanban', icon: Kanban, label: 'Kanban Board' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const adminItems = [
  { to: '/admin', icon: Users, label: 'Admin Panel' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarVariants = {
    open: { width: 256, transition: { duration: 0.3, ease: 'easeInOut' } },
    closed: { width: 72, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className="relative hidden lg:flex flex-col h-full z-30 flex-shrink-0"
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-lg gradient-text whitespace-nowrap"
            >
              TaskTrack
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }>
            <Icon size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-white/5" />
            <p className={`px-4 text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1 ${!isOpen ? 'hidden' : ''}`}>
              Admin
            </p>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }>
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-3">
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
            }
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="whitespace-nowrap">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', boxShadow: '0 0 12px rgba(6,182,212,0.4)' }}
      >
        {isOpen
          ? <ChevronLeft size={12} className="text-white" />
          : <ChevronRight size={12} className="text-white" />
        }
      </button>
    </motion.aside>
  );
}
