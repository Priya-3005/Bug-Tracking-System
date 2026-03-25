import React from 'react';
import {
  LayoutDashboard, Bug, Users, Settings, LogOut,
  ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'developer', 'tester'] },
  { id: 'bugs', label: 'All Bugs', icon: Bug, roles: ['admin', 'developer', 'tester'] },
  { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { user, logout } = useAuth();

  const visible = navItems.filter((n) => n.roles.includes(user?.role));

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm shadow-brand-600/30">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-800">BugTrackr</span>
            <div className="text-[10px] font-mono text-slate-400 leading-none mt-0.5">Issue Tracking System</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">Menu</div>
        {visible.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-link w-full justify-between group ${isActive ? 'active' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Icon size={16} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} />
                {item.label}
              </span>
              {isActive && <ChevronRight size={14} className="text-brand-400" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 capitalize font-medium">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 mt-0.5"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
