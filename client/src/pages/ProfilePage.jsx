import { useState } from 'react';
import { User, Mail, Lock, Shield, Sparkles, Key, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80',
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const selectAvatar = (url) => setProfileForm(p => ({ ...p, avatar: url }));

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) return toast.error('Name and Email are required');

    setLoadingProfile(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.data);
      toast.success('Profile details updated successfully! 👤');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all password fields');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoadingPassword(true);
    try {
      await authAPI.updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully! 🔑');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-black text-white flex items-center gap-2">
          <User className="text-primary" size={28} /> My Profile
        </h1>
        <p className="text-slate-400 mt-1">Configure your personal preferences, security keys, and account avatar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Avatar presets */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/30"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
            {profileForm.avatar ? (
              <img src={profileForm.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary">
              {user?.role}
            </span>
          </div>

          <div className="w-full border-t border-white/5 pt-4 text-left">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preset Avatars</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((url, i) => {
                const isSelected = profileForm.avatar === url;
                return (
                  <button
                    key={i}
                    onClick={() => selectAvatar(url)}
                    className={`relative w-9 h-9 rounded-full overflow-hidden transition-all hover:scale-105 hover:ring-2 hover:ring-primary/45 ${
                      isSelected ? 'ring-2 ring-primary scale-105' : 'ring-1 ring-white/5'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avatar URL</label>
              <input
                name="avatar"
                type="text"
                placeholder="https://example.com/avatar.png"
                value={profileForm.avatar}
                onChange={handleProfileChange}
                className="input-field py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Update Forms (Col Span 2) */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" /> Profile Settings
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <User size={12} className="inline mr-1" /> Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Mail size={12} className="inline mr-1" /> Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <motion.button
                  type="submit"
                  disabled={loadingProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary px-6 py-2.5 text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingProfile ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  ) : null}
                  Save Profile Settings
                </motion.button>
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Key size={18} className="text-primary" /> Security Keys
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <motion.button
                  type="submit"
                  disabled={loadingPassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary px-6 py-2.5 text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingPassword ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  ) : null}
                  Update Password Key
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
