import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, updateAdminConfig } from '../../services/api';
import { Save, RefreshCw, AlertCircle, CheckCircle2, ToggleLeft, ToggleRight, DollarSign, Percent, Settings, HelpCircle, Layers } from 'lucide-react';

export default function ConfigEditor({ token }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    loadConfig();
  }, [token]);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminConfig(token);
      setConfig(data);
    } catch (err) {
      setError(err.message || 'Failed to load configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleModifierChange = (field, val) => {
    setConfig((prev) => ({
      ...prev,
      modifiers: {
        ...prev.modifiers,
        [field]: Number(val)
      }
    }));
  };

  const handleQuestionToggle = (qIndex) => {
    setConfig((prev) => {
      const newQs = [...prev.questions];
      newQs[qIndex].active = !newQs[qIndex].active;
      return { ...prev, questions: newQs };
    });
  };

  const handleQuestionLabelChange = (qIndex, newLabel) => {
    setConfig((prev) => {
      const newQs = [...prev.questions];
      newQs[qIndex].label = newLabel;
      return { ...prev, questions: newQs };
    });
  };

  const handleOptionChange = (qIndex, optIndex, field, val) => {
    setConfig((prev) => {
      const newQs = [...prev.questions];
      const newOptions = [...newQs[qIndex].options];
      newOptions[optIndex] = {
        ...newOptions[optIndex],
        [field]: field === 'label' || field === 'value' ? val : Number(val)
      };
      newQs[qIndex].options = newOptions;
      return { ...prev, questions: newQs };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await updateAdminConfig(config, token);
      setConfig(res.config);
      setSuccessMsg(`Config Version ${res.config.config_version} Published Live! Public estimator updated instantly.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      setError(err.message || 'Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-sky-400" /> Loading configuration editor...
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="p-6 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <span>{error}</span>
        </div>
        <button onClick={loadConfig} className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Save Button Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Config & Pricing Editor</h2>
            <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-xs font-mono font-bold">
              v{config?.config_version}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Updates here reflect instantly on the public estimator without any code redeployments.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 text-sm"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Saving & Incrementing...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save & Publish Live Rates
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Global Modifiers Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-400" /> Global Calculation Modifiers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Waste Factor (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                value={Math.round((config?.modifiers?.waste_factor || 0.10) * 100)}
                onChange={(e) => handleModifierChange('waste_factor', Number(e.target.value) / 100)}
                className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-sky-500 focus:outline-none"
              />
              <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Default 10% waste buffer</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Permit Flat Fee ($)
            </label>
            <div className="relative">
              <input
                type="number"
                value={config?.modifiers?.permit_flat_fee || 350}
                onChange={(e) => handleModifierChange('permit_flat_fee', e.target.value)}
                className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-sky-500 focus:outline-none"
              />
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Fixed municipal fee added</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Estimate Range Spread (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={config?.modifiers?.range_spread_pct || 12}
                onChange={(e) => handleModifierChange('range_spread_pct', e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-sky-500 focus:outline-none"
              />
              <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">creates E_low to E_high spread</span>
          </div>
        </div>
      </div>

      {/* Dynamic Questions & Rates List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-400" /> Dynamic Estimator Questions & Pricing Rates
        </h3>

        {config?.questions?.map((question, qIdx) => (
          <div
            key={question.key || qIdx}
            className={`glass-card p-6 rounded-2xl border transition ${
              question.active ? 'border-slate-800' : 'border-slate-900 opacity-60 bg-slate-950/60'
            }`}
          >
            {/* Question Header & Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3 flex-1">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg uppercase">
                  {question.key}
                </span>
                <input
                  type="text"
                  value={question.label}
                  onChange={(e) => handleQuestionLabelChange(qIdx, e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-sky-500 text-white font-semibold text-base px-3 py-1.5 rounded-lg focus:outline-none"
                  placeholder="Question Label"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {question.active ? 'Active on Public Tool' : 'Hidden / Inactive'}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuestionToggle(qIdx)}
                  className="text-sky-400 hover:text-sky-300 transition"
                >
                  {question.active ? (
                    <ToggleRight className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Options & Rates Table for Select Questions */}
            {question.type === 'select' && question.options && (
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Options & Rates
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((opt, optIdx) => (
                    <div
                      key={opt.value || optIdx}
                      className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                    >
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Option Label</label>
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, 'label', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg"
                        />
                      </div>

                      {/* Material Rate */}
                      {question.key === 'material' && (
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-0.5 font-semibold">
                            Material Rate ($/sq ft)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={opt.rate_per_sqft || 0}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, 'rate_per_sqft', e.target.value)}
                            className="w-full bg-slate-950 border border-sky-500/50 text-sky-400 font-mono font-bold text-xs px-3 py-1.5 rounded-lg"
                          />
                        </div>
                      )}

                      {/* Pitch & Stories Multiplier */}
                      {(question.key === 'pitch' || question.key === 'stories') && (
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-0.5 font-semibold">
                            Multiplier (e.g. 1.12)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={opt.multiplier || 1.0}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, 'multiplier', e.target.value)}
                            className="w-full bg-slate-950 border border-sky-500/50 text-sky-400 font-mono font-bold text-xs px-3 py-1.5 rounded-lg"
                          />
                        </div>
                      )}

                      {/* Tear-Off Rate */}
                      {question.key === 'layers' && (
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-0.5 font-semibold">
                            Tear-Off Fee ($/sq ft)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={opt.tear_off_per_sqft || 0}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, 'tear_off_per_sqft', e.target.value)}
                            className="w-full bg-slate-950 border border-sky-500/50 text-sky-400 font-mono font-bold text-xs px-3 py-1.5 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
