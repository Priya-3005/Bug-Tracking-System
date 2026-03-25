import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { StatusBadge, PriorityBadge, SeverityBadge } from './Badge';
import { timeAgo } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Spinner } from './Loader';
import { MessageCircle, Send, User, Calendar, Monitor } from 'lucide-react';

const ALL_STATUSES = ['new', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened'];

export default function BugDetailModal({ bug, isOpen, onClose, onUpdated, developers }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(bug?.status || 'new');
  const [assignedTo, setAssignedTo] = useState(bug?.assignedTo || '');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [localBug, setLocalBug] = useState(bug);

  useEffect(() => {
    setLocalBug(bug);
    setStatus(bug?.status || 'new');
    setAssignedTo(bug?.assignedTo || '');
  }, [bug]);

  const isAdmin = user?.role === 'admin';

  const handleSave = async () => {
    setSaving(true);
    try {
      const devObj = developers?.find((d) => d._id === assignedTo);
      const payload = { status };
      if (isAdmin) {
        payload.assignedTo = assignedTo || null;
        payload.assignedToName = devObj?.name || null;
      }
      const res = await api.put(`/bugs/${localBug._id}`, payload);
      setLocalBug(res.data);
      onUpdated(res.data);
      toast.success('Bug updated!');
    } catch {
      toast.error('Failed to update bug');
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      const res = await api.post(`/bugs/${localBug._id}/comments`, { text: comment });
      setLocalBug(res.data);
      onUpdated(res.data);
      setComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  if (!localBug) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bug #${localBug._id?.slice(-6).toUpperCase()}`} size="xl">
      <div className="p-5 space-y-5">
        {/* Title & badges */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">{localBug.title}</h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={localBug.status} />
            <PriorityBadge priority={localBug.priority} />
            <SeverityBadge severity={localBug.severity} />
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-slate-400" />
            <span className="text-slate-500">Reported by</span>
            <span className="font-medium text-slate-700">{localBug.reportedByName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-slate-500">Created</span>
            <span className="font-medium text-slate-700">{timeAgo(localBug.createdAt)}</span>
          </div>
          {localBug.assignedToName && (
            <div className="flex items-center gap-2 text-sm">
              <User size={14} className="text-slate-400" />
              <span className="text-slate-500">Assigned to</span>
              <span className="font-medium text-slate-700">{localBug.assignedToName}</span>
            </div>
          )}
          {localBug.environment && (
            <div className="flex items-center gap-2 text-sm">
              <Monitor size={14} className="text-slate-400" />
              <span className="text-slate-500">Env</span>
              <span className="font-medium text-slate-700">{localBug.environment}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{localBug.description}</p>
        </div>

        {/* Steps */}
        {localBug.stepsToReproduce && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Steps to Reproduce</h3>
            <pre className="text-sm text-slate-700 font-mono bg-slate-50 rounded-lg p-3 whitespace-pre-wrap">
              {localBug.stepsToReproduce}
            </pre>
          </div>
        )}

        {/* Update section */}
        <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">Update Bug</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            {isAdmin && (
              <div>
                <label className="label">Assign To</label>
                <select className="select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">Unassigned</option>
                  {developers?.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button className="btn-primary mt-3" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : null}
            Save Changes
          </button>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
            <MessageCircle size={12} />
            Comments ({localBug.comments?.length || 0})
          </h3>

          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
            {localBug.comments?.length === 0 && (
              <p className="text-sm text-slate-400 italic">No comments yet. Be the first!</p>
            )}
            {localBug.comments?.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.userName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">{c.userName}</span>
                    <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-600">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleComment()}
            />
            <button className="btn-primary px-3" onClick={handleComment} disabled={commenting}>
              {commenting ? <Spinner size="sm" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
