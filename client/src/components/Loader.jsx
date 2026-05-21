import { motion } from 'framer-motion';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid rgba(6,182,212,0.15)' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: '#06B6D4' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: '#8B5CF6' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark gap-6">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid rgba(6,182,212,0.1)' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid transparent', borderTopColor: '#06B6D4' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="text-center">
        <p className="font-display text-xl font-bold gradient-text">TaskTrack</p>
        <p className="text-sm text-slate-500 mt-1">Loading your workspace...</p>
      </div>
    </div>
  );
}
