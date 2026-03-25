import React, { useEffect, useState } from 'react';
import { Bug, CheckCircle, Clock, AlertTriangle, Flame, XCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { timeAgo } from '../utils/helpers';
import { PageLoader } from '../components/Loader';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
  <div className="card p-5 hover:shadow-md transition-all duration-200 group cursor-default">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      {trend !== undefined && (
        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1 tabular-nums">{value}</div>
    <div className="text-sm text-slate-500 font-medium">{label}</div>
  </div>
);

export default function Dashboard({ onNavigateToBugs }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, bugsRes] = await Promise.all([
          api.get('/bugs/stats'),
          api.get('/bugs?limit=5'),
        ]);
        setStats(statsRes.data);
        setRecent(bugsRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  const statCards = [
    { icon: Bug, label: 'Total Bugs', value: stats?.total ?? 0, color: 'text-brand-600', bgColor: 'bg-brand-50' },
    { icon: AlertTriangle, label: 'Open Bugs', value: stats?.open ?? 0, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { icon: Clock, label: 'In Progress', value: stats?.inProgress ?? 0, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: CheckCircle, label: 'Resolved', value: stats?.resolved ?? 0, color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Flame, label: 'Critical', value: stats?.critical ?? 0, color: 'text-red-600', bgColor: 'bg-red-50' },
    { icon: XCircle, label: 'Closed', value: stats?.closed ?? 0, color: 'text-slate-500', bgColor: 'bg-slate-100' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-lg shadow-brand-600/20">
        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-200 mb-1">Welcome back</div>
          <h2 className="text-2xl font-bold mb-1">{user?.name} 👋</h2>
          <p className="text-brand-200 text-sm capitalize">Role: {user?.role} · BugTrackr Dashboard</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -right-4 top-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent Bugs */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Bugs</h3>
          <button
            onClick={onNavigateToBugs}
            className="text-xs text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-14 text-center">
            <Bug size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No bugs yet. Start by reporting one!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recent.map((bug) => (
              <div
                key={bug._id}
                className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors flex items-center gap-4 cursor-pointer group"
                onClick={onNavigateToBugs}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">#{bug._id.slice(-6).toUpperCase()}</span>
                    <span className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                      {bug.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">by {bug.reportedByName}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">{timeAgo(bug.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={bug.priority} />
                  <StatusBadge status={bug.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
