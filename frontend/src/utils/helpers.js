import { formatDistanceToNow } from 'date-fns';

export const timeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'unknown';
  }
};

export const statusConfig = {
  new: { label: 'New', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  closed: { label: 'Closed', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  reopened: { label: 'Reopened', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export const priorityConfig = {
  low: { label: 'Low', color: 'bg-green-100 text-green-700', icon: '▼' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700', icon: '●' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700', icon: '▲' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700', icon: '🔥' },
};

export const severityConfig = {
  minor: { label: 'Minor', color: 'bg-sky-100 text-sky-700' },
  major: { label: 'Major', color: 'bg-orange-100 text-orange-700' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700' },
  blocker: { label: 'Blocker', color: 'bg-purple-100 text-purple-700' },
};

export const roleConfig = {
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
  developer: { label: 'Developer', color: 'bg-blue-100 text-blue-700' },
  tester: { label: 'Tester', color: 'bg-green-100 text-green-700' },
};
