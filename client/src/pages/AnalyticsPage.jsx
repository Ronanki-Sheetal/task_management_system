import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, Zap, Users } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, BarChart, Bar,
  Cell, PieChart, Pie
} from 'recharts';

const COLORS = ['#06B6D4', '#8B5CF6', '#3B82F6', '#EF4444', '#10B981'];

export default function AnalyticsPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState([]);
  const [completionStats, setCompletionStats] = useState([]);
  const [productivityStats, setProductivityStats] = useState([]);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [dailyRes, completionRes, overviewRes] = await Promise.all([
          analyticsAPI.getDaily(14),
          analyticsAPI.getCompletion(),
          analyticsAPI.getOverview(),
        ]);
        setDailyStats(dailyRes.data.data);
        setCompletionStats(completionRes.data.data);
        setOverview(overviewRes.data.data);

        if (isAdmin) {
          const prodRes = await analyticsAPI.getProductivity();
          setProductivityStats(prodRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [isAdmin]);

  if (loading) return <Loader text="Assembling workspace intelligence..." />;

  // Transform priority distribution for PieChart
  const priorityData = overview?.priorityDist?.map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.count
  })) || [];

  // Transform category distribution for BarChart
  const categoryData = overview?.categoryDist?.map(c => ({
    name: c._id,
    count: c.count
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-black text-white flex items-center gap-2">
          <BarChart3 className="text-primary" size={28} /> Workspace Analytics
        </h1>
        <p className="text-slate-400 mt-1">Deep dive into execution statistics, completion rates, and team metrics.</p>
      </div>

      {/* Grid: Tasks created per day & Completion rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Created Per Day (Last 14 Days) */}
        <div className="glass-card p-6 flex flex-col justify-between" style={{ minHeight: '380px' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Daily Task Volume</h2>
            <p className="text-xs text-slate-500 mt-0.5">Created vs completed tasks over the last 14 days</p>
          </div>
          <div className="flex-1 w-full min-h-[250px] mt-4">
            {dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area name="Created" type="monotone" dataKey="created" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                  <Area name="Completed" type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No activity recorded</div>
            )}
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div className="glass-card p-6 flex flex-col justify-between" style={{ minHeight: '380px' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Completion Efficiency</h2>
            <p className="text-xs text-slate-500 mt-0.5">Average task completion rate (%) by weekday</p>
          </div>
          <div className="flex-1 w-full min-h-[250px] mt-4">
            {completionStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar name="Completion Rate (%)" dataKey="rate" fill="#8B5CF6" radius={[6, 6, 0, 0]}>
                    {completionStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No data recorded this week</div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Priority Breakdown & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority breakdown */}
        <div className="glass-card p-6 flex flex-col justify-between" style={{ minHeight: '360px' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Priority Distribution</h2>
            <p className="text-xs text-slate-500 mt-0.5">Breakdown of priority status</p>
          </div>
          <div className="flex-1 w-full min-h-[200px] mt-4 relative">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
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

        {/* Category distribution */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between" style={{ minHeight: '360px' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Task Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">Count of tasks by categories</p>
          </div>
          <div className="flex-1 w-full min-h-[220px] mt-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar name="Tasks count" dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

      {/* Admin Feature: User Productivity Leaderboard */}
      {isAdmin && (
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-primary animate-pulse" /> User Productivity Rankings (Admin Only)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Top performing team members sorted by task completion rate</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Productivity Score</th>
                  <th>Total Tasks</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {productivityStats.length > 0 ? (
                  productivityStats.map(member => (
                    <tr key={member._id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                            {member.avatar ? (
                              <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span>{member.name?.[0]?.toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${member.productivity}%` }} />
                          </div>
                          <span className="text-sm font-bold text-white">{Math.round(member.productivity)}%</span>
                        </div>
                      </td>
                      <td className="text-slate-300 font-semibold">{member.total}</td>
                      <td className="text-emerald-400 font-semibold">{member.completed}</td>
                      <td className="text-cyan-400 font-semibold">{member.inProgress}</td>
                      <td className="text-amber-400 font-semibold">{member.pending}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-500">No user stats available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
