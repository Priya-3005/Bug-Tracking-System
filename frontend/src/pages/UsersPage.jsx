import React, { useEffect, useState } from 'react';
import { Users, Shield, Code, Bug } from 'lucide-react';
import { roleConfig, timeAgo } from '../utils/helpers';
import { PageLoader } from '../components/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then((r) => setUsers(r.data)).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data : u)));
      toast.success('Role updated successfully');
    } catch {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <PageLoader />;

  const roleIcons = { admin: Shield, developer: Code, tester: Bug };

  const counts = {
    admin: users.filter((u) => u.role === 'admin').length,
    developer: users.filter((u) => u.role === 'developer').length,
    tester: users.filter((u) => u.role === 'tester').length,
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800">User Management</h2>
        <p className="text-sm text-slate-400 mt-0.5">{users.length} registered users</p>
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(counts).map(([role, count]) => {
          const Icon = roleIcons[role];
          const cfg = roleConfig[role];
          return (
            <div key={role} className="card p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color} bg-opacity-20`}
                style={{ background: role === 'admin' ? '#f5f3ff' : role === 'developer' ? '#eff6ff' : '#f0fdf4' }}>
                <Icon size={18} className={role === 'admin' ? 'text-purple-600' : role === 'developer' ? 'text-blue-600' : 'text-green-600'} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800 tabular-nums">{count}</div>
                <div className="text-sm text-slate-500 capitalize font-medium">{role}s</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Users size={16} className="text-slate-400" />
          <h3 className="font-bold text-slate-800">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => {
                const cfg = roleConfig[u.role] || roleConfig.tester;
                return (
                  <tr key={u._id} className="table-row-hover transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{u.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{timeAgo(u.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <select
                        className="select w-auto text-xs py-1.5"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="developer">Developer</option>
                        <option value="tester">Tester</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
