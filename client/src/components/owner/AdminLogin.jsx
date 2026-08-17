import React, { useState } from 'react';
import { loginAdmin } from '../../services/api';
import { Lock, User, Key, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('roofing2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginAdmin({ username, password });
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Invalid username or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Owner & Bookkeeper Login</h2>
        <p className="text-slate-400 text-xs mt-1">Northline Roofing & Exteriors Admin Portal</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Username
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 text-sm mt-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" /> Sign In to Owner Panel
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
        Default credentials: <span className="text-slate-300 font-mono">admin</span> / <span className="text-slate-300 font-mono">roofing2026!</span>
      </div>
    </div>
  );
}
