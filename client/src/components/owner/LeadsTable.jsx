import React, { useState, useEffect } from 'react';
import { fetchAdminLeads } from '../../services/api';
import { RefreshCw, AlertCircle, ChevronDown, ChevronUp, User, Phone, Mail, Calendar, DollarSign, FileText } from 'lucide-react';

export default function LeadsTable({ token }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLeadId, setExpandedLeadId] = useState(null);

  useEffect(() => {
    loadLeads();
  }, [token]);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminLeads(token);
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedLeadId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-sky-400" /> Loading captured customer leads...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <span>{error}</span>
        </div>
        <button onClick={loadLeads} className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Captured Homeowner Leads
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Total {leads.length} recorded leads with submitted answers & cost ranges
          </p>
        </div>
        <button
          onClick={loadLeads}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Leads
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p>No homeowner leads recorded yet. Complete the public estimator to generate your first lead!</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Estimated Range</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">Date Captured</th>
                  <th className="p-4 text-right pr-6">Answers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {leads.map((lead) => {
                  const isExpanded = expandedLeadId === (lead._id || lead.lead_id);
                  const formattedDate = lead.captured_at
                    ? new Date(lead.captured_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A';

                  return (
                    <React.Fragment key={lead._id || lead.lead_id}>
                      <tr
                        onClick={() => toggleExpand(lead._id || lead.lead_id)}
                        className="hover:bg-slate-800/40 cursor-pointer transition"
                      >
                        <td className="p-4 pl-6 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{lead.name}</span>
                          </div>
                        </td>

                        <td className="p-4 text-slate-300">
                          <div className="text-xs space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-slate-500" /> {lead.phone}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Mail className="w-3.5 h-3.5 text-slate-500" /> {lead.email}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono font-bold text-sky-400">
                          ${lead.estimate_low?.toLocaleString()} - ${lead.estimate_high?.toLocaleString()}
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg border border-slate-700">
                            v{lead.config_version}
                          </span>
                        </td>

                        <td className="p-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>

                        <td className="p-4 text-right pr-6">
                          <button className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Submitted Answers Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-b border-slate-800">
                          <td colSpan={6} className="p-6">
                            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
                                Customer Submitted Answers (Lead ID: {lead.lead_id || lead._id})
                              </h4>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                {Object.entries(lead.answers || {}).map(([key, val]) => (
                                  <div key={key} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                                    <span className="text-slate-500 uppercase tracking-wider block font-bold text-[10px]">
                                      {key}
                                    </span>
                                    <span className="text-slate-200 font-semibold text-sm mt-0.5 block">
                                      {String(val)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
