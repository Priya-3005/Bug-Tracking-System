import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  dashboard: { title: 'Dashboard', sub: 'Overview of all issues' },
  bugs: { title: 'Bug Tracker', sub: 'Manage and track issues' },
  users: { title: 'User Management', sub: 'Manage team members' },
};

export default function TopBar({ activePage, searchQuery, setSearchQuery }) {
  const { user } = useAuth();
  const { title, sub } = pageTitles[activePage] || { title: activePage, sub: '' };

  return (
    <header className="h-16 bg-white/80 glass border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search - only on bugs page */}
        {activePage === 'bugs' && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-8 w-56 py-2"
            />
          </div>
        )}

        {/* Notification Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
