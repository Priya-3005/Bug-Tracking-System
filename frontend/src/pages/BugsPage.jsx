import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Filter, RefreshCw, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { StatusBadge, PriorityBadge, SeverityBadge } from '../components/Badge';
import { timeAgo } from '../utils/helpers';
import { PageLoader, SkeletonRow } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import CreateBugModal from '../components/CreateBugModal';
import BugDetailModal from '../components/BugDetailModal';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'new', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened'];
const PRIORITIES = ['all', 'low', 'medium', 'high', 'critical'];

export default function BugsPage({ searchQuery }) {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPriority !== 'all') params.priority = filterPriority;
      if (searchQuery) params.search = searchQuery;
      const res = await api.get('/bugs', { params });
      setBugs(res.data);
    } catch {
      toast.error('Failed to load bugs');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, searchQuery]);

  useEffect(() => { fetchBugs(); }, [fetchBugs]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/users/developers').then((r) => setDevelopers(r.data)).catch(() => {});
    }
  }, [user]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this bug?')) return;
    try {
      await api.delete(`/bugs/${id}`);
      setBugs((prev) => prev.filter((b) => b._id !== id));
      toast.success('Bug deleted');
    } catch {
      toast.error('Failed to delete bug');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  };

  const sortedBugs = [...bugs].sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-brand-500" />
      : <ChevronDown size={12} className="text-brand-500" />;
  };

  const ThBtn = ({ label, field }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-brand-600 transition-colors">
      {label} <SortIcon field={field} />
    </button>
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Bug Reports</h2>
          <p className="text-sm text-slate-400 mt-0.5">{bugs.length} issue{bugs.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchBugs} className="btn-secondary py-2 px-3">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} />
            Report Bug
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card px-4 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Filter size={14} /> Filters:
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Status:</span>
            <div className="flex gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                    filterStatus === s
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Priority:</span>
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                    filterPriority === p
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ThBtn label="ID" field="_id" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ThBtn label="Title" field="title" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ThBtn label="Status" field="status" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ThBtn label="Priority" field="priority" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Severity
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ThBtn label="Created" field="createdAt" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : sortedBugs.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No bugs found"
                      description="No bugs match your current filters. Try adjusting them or report a new bug."
                      action={
                        <button onClick={() => setShowCreate(true)} className="btn-primary">
                          <Plus size={16} /> Report Bug
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                sortedBugs.map((bug) => (
                  <tr
                    key={bug._id}
                    className="table-row-hover cursor-pointer transition-colors"
                    onClick={() => setSelectedBug(bug)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{bug._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{bug.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">by {bug.reportedByName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={bug.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={bug.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={bug.severity} />
                    </td>
                    <td className="px-4 py-3">
                      {bug.assignedToName ? (
                        <span className="text-sm text-slate-700 font-medium">{bug.assignedToName}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{timeAgo(bug.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedBug(bug); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-brand-50 hover:text-brand-600 text-slate-400 transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={(e) => handleDelete(bug._id, e)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateBugModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(bug) => setBugs((prev) => [bug, ...prev])}
      />

      {selectedBug && (
        <BugDetailModal
          bug={selectedBug}
          isOpen={!!selectedBug}
          onClose={() => setSelectedBug(null)}
          developers={developers}
          onUpdated={(updated) => {
            setBugs((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
            setSelectedBug(updated);
          }}
        />
      )}
    </div>
  );
}
