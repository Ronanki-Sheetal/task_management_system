import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AnalyticsCard({ title, value, subtitle, icon: Icon, color = '#06B6D4', trend, trendValue, index = 0 }) {
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card glass-card-hover p-5"
      style={{ borderTop: `2px solid ${color}40` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={22} style={{ color }} />
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}%
          </div>
        )}
      </div>

      <div>
        <p className="text-3xl font-display font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-semibold text-slate-300">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Glow accent line */}
      <div className="mt-4 h-0.5 rounded-full opacity-40"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </motion.div>
  );
}
