import React, { useState } from 'react';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Spinner } from '../components/Loader';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // login | register
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tester' });

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        if (!form.name.trim()) { toast.error('Name is required'); return; }
        await register(form.name, form.email, form.password, form.role);
        toast.success('Account created! Welcome to BugTrackr!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in as demo user!');
    } catch {
      toast.error('Demo login failed. Make sure to seed the DB first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-brand-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="card shadow-xl shadow-slate-200/80 p-8 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 bg-brand-600 rounded-2xl items-center justify-center shadow-lg shadow-brand-600/30 mb-4">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">BugTrackr</h1>
            <p className="text-slate-400 text-sm mt-1">Issue Tracking System</p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                  mode === m ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="animate-slide-up">
                <label className="label">Full Name</label>
                <input className="input" placeholder="John Doe" value={form.name} onChange={set('name')} required />
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="animate-slide-up">
                <label className="label">Role</label>
                <select className="select" value={form.role} onChange={set('role')}>
                  <option value="tester">Tester / Reporter</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn-primary w-full justify-center py-2.5 mt-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo accounts */}
          {mode === 'login' && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-xs text-center text-slate-400 font-medium mb-3">Quick Demo Login</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '👑 Admin', email: 'admin@demo.com', password: 'demo123' },
                  { label: '💻 Dev', email: 'dev@demo.com', password: 'demo123' },
                  { label: '🧪 Tester', email: 'tester@demo.com', password: 'demo123' },
                ].map((d) => (
                  <button
                    key={d.label}
                    onClick={() => demoLogin(d.email, d.password)}
                    className="text-xs font-semibold py-2 px-2 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 transition-all duration-200 border border-slate-200 hover:border-brand-200"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">Run seed script first to use demo accounts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
