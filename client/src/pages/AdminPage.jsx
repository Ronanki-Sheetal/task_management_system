import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Shield, Power, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAll({ page, limit: 8, search });
      setUsers(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, 300); // debounce API requests
    return () => clearTimeout(handler);
  }, [page, search]);

  const handleDelete = async (id, name) => {
    if (id === currentUser.id) return toast.error("You cannot delete your own account");
    if (!confirm(`Are you sure you want to delete ${name} and all their tasks? This action is permanent.`)) return;

    try {
      await userAPI.remove(id);
      toast.success(`${name} has been deleted`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleRoleToggle = async (id, currentRole, name) => {
    if (id === currentUser.id) return toast.error("You cannot change your own role");
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role of ${name} to ${newRole.toUpperCase()}?`)) return;

    try {
      await userAPI.updateRole(id, newRole);
      toast.success(`Role updated for ${name}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleStatusToggle = async (id, name) => {
    if (id === currentUser.id) return toast.error("You cannot deactivate yourself");
    try {
      const { data } = await userAPI.toggleStatus(id);
      toast.success(data.message);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to toggle user status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-black text-white flex items-center gap-2">
          <Users className="text-primary" size={28} /> Admin Control Panel
        </h1>
        <p className="text-slate-400 mt-1">Manage user access rights, security credentials, and organization roles.</p>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users by name/email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Users table */}
      {loading && users.length === 0 ? (
        <Loader text="Loading users directory..." />
      ) : users.length === 0 ? (
        <div className="glass-card py-20 text-center text-slate-500">No users found.</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>System Role</th>
                  <th>Total Tasks</th>
                  <th>Productivity Score</th>
                  <th>Access Control</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const isSelf = user._id === currentUser.id;
                  return (
                    <tr key={user._id} className={!user.isActive ? 'opacity-50' : ''}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                            {user.avatar ? (
                              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span>{user.name?.[0]?.toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                              {user.name} {isSelf && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase font-bold">You</span>}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          user.role === 'admin' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' : 'bg-slate-700/35 text-slate-400'
                        }`}>
                          <Shield size={12} /> {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-slate-300 font-semibold">{user.taskCount}</td>
                      <td>
                        <span className="text-sm font-bold text-white">{user.productivity}%</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleStatusToggle(user._id, user.name)}
                          disabled={isSelf}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl transition-all ${
                            user.isActive
                              ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20'
                              : 'text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <Power size={11} /> {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleRoleToggle(user._id, user.role, user.name)}
                            disabled={isSelf}
                            className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-40"
                            title="Toggle Admin/User"
                          >
                            <Shield size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={isSelf}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40"
                            title="Delete user"
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-white/5 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-slate-400">
            Page <strong className="text-white">{page}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-white/5 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
