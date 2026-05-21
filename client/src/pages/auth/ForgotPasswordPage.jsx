import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword({ email });
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      setSubmitted(true);
      toast.success('Reset email sent successfully! 📬');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden page-wrapper">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl gradient-text">TaskTrack</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card py-8 px-6 sm:px-10 shadow-2xl"
          style={{ border: '1px solid rgba(6, 182, 212, 0.15)' }}
        >
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/25">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">Check your email</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We've sent a password reset link to <strong className="text-slate-200">{email}</strong>. Please check your inbox and spam folders.
              </p>
              {resetToken && (
                <div className="p-3 bg-cyan-950/40 border border-cyan-800/35 rounded-xl space-y-2 mt-4">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Local Testing Bypass</p>
                  <p className="text-slate-400 text-xs">Since email mailing is mock, use this button to proceed:</p>
                  <Link to={`/reset-password/${resetToken}`} className="btn-primary w-full py-2 text-xs">
                    Reset Password Now
                  </Link>
                </div>
              )}
              <div className="pt-4">
                <Link to="/login" className="btn-ghost w-full py-2.5 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={16} />
                  </>
                )}
              </motion.button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                  <ArrowLeft size={12} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
