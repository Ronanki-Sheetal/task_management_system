import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare, Play, Clock, AlertTriangle, TrendingUp,
  Calendar, Flag, ChevronRight, Zap
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { analyticsAPI } from '../services/api';
import AnalyticsCard from '../components/AnalyticsCard';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#06B6D4', '#8B5CF6', '#3B82F6', '#EF4444', '#10B981'];

export default function Dashboard() {
  const { stats, loading: statsLoading, fetchStats } = useTask();
  const navigate = useNavigate();
  const [dailyData, setDailyData] = useState([]);
  const [loadingDaily, setLoadingDaily] = useState(false);

  useEffect(() => {
    fetchStats();
    
    const loadDaily = async () => {
      setLoadingDaily(true);
      try {
        const { data } = await analyticsAPI.getDaily(7);
        setDailyData(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDaily(false);
      }
    };
    loadDaily();
  }, [fetchStats]);

  if (statsLoading || !stats) {
    return <Loader text="Loading your dashboard analytics..." />;
  }

  // Formatting Priority Stats for Recharts Pie
  const priorityData = stats.priorityStats?.map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.count
  })) || [];

  // Formatting Category Stats for Recharts Bar
  const categoryData = stats.categoryStats?.map(c => ({
    name: c._id,
    count: c.count
  })) || [];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white flex items-center gap-2">
            <Zap className="text-primary animate-pulse" size={28} /> Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Here is a quick overview of your workspace productivity.</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="btn-ghost text-xs">
          View All Tasks <ChevronRight size={14} />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnalyticsCard
          title="Total Tasks"
          value={stats.total || 0}
          icon={CheckSquare}
          color="#3B82F6"
          index={0}
        />
        <AnalyticsCard
          title="Completed"
          value={stats.completed || 0}
          icon={CheckSquare}
          color="#10B981"
          index={1}
        />
        <AnalyticsCard
          title="In Progress"
          value={stats.inProgress || 0}
          icon={Play}
          color="#06B6D4"
          index={2}
        />
        <AnalyticsCard
          title="Overdue"
          value={stats.overdue || 0}
          icon={AlertTriangle}
          color="#EF4444"
          index={3}
        />
        <AnalyticsCard
          title="Productivity"
          value={`${stats.productivityScore || 0}%`}
          subtitle="Completion Rate"
          icon={TrendingUp}
          color="#8B5CF6"
          index={4}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between" style={{ minHeight: '380px' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Weekly Progress</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tasks created vs completed daily</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            {loadingDaily ? (
              <div className="h-full flex items-center justify-center"><Loader text="Loading chart..." /></div>
            ) : dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Area name="Tasks Created" type="monotone" dataKey="created" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                  <Area name="Tasks Completed" type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No activity recorded this week</div>
            )}
          </div>
        </div>

        {/* Priority distribution */}
        <div className="glass-card p-6 flex flex-col justify-between" style={{ minHeight: '380px' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Priority Distribution</h2>
            <p className="text-xs text-slate-500 mt-0.5">Distribution of all tasks by priority</p>
          </div>
          <div className="flex-1 w-full min-h-[220px] relative">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">No tasks created yet</div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {priorityData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentTasks?.length > 0 ? (
              stats.recentTasks.map((t, idx) => (
                <TaskCard key={t._id} task={t} index={idx} compact={true} />
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center py-6">No tasks available</p>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Top Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top 5 categories by task volume</p>
          </div>
          <div className="flex-1 w-full min-h-[220px] mt-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" fill="url(#colorCreated)">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No category distribution data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
