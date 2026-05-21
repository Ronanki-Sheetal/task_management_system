import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 relative overflow-hidden page-wrapper">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card max-w-md w-full p-8 text-center space-y-6 relative z-10"
        style={{ border: '1px solid rgba(6,182,212,0.15)' }}
      >
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto animate-bounce">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black gradient-text">404</h1>
          <h2 className="text-xl font-bold text-white">Route not found</h2>
          <p className="text-slate-500 text-sm">
            The page you are looking for does not exist or has been relocated to another workspace.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
