import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import ConfigEditor from './ConfigEditor';
import LeadsTable from './LeadsTable';
import { ShieldCheck, LogOut, Sliders, Users, Building2 } from 'lucide-react';

export default function OwnerDashboard() {
  const [token, setToken] = useState(localStorage.getItem('owner_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('owner_user') || 'null'));
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'leads'

  const handleLoginSuccess = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('owner_token', authToken);
    localStorage.setItem('owner_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('owner_token');
    localStorage.removeItem('owner_user');
  };

  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Owner & Bookkeeper Portal</h1>
            <p className="text-slate-400 text-xs">Logged in as <span className="text-sky-400 font-semibold">{user?.username || 'admin'}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Tab Navigation */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'config'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" /> Pricing & Config
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Customer Leads
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-slate-900 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-slate-800 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'config' && <ConfigEditor token={token} />}
      {activeTab === 'leads' && <LeadsTable token={token} />}
    </div>
  );
}
