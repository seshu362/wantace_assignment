import React, { useState } from 'react';
import EstimatorWizard from './components/estimator/EstimatorWizard';
import OwnerDashboard from './components/owner/OwnerDashboard';
import { Calculator, ShieldCheck, Home, Wrench, ExternalLink, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSurface, setActiveSurface] = useState('estimator'); // 'estimator' | 'owner'

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Business Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveSurface('estimator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Wrench className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block">
                Northline Roofing <span className="text-sky-400 font-light">& Exteriors</span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-1 font-medium">Columbus, OH</span>
            </div>
          </div>

          {/* Surface Toggle Buttons */}
          <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSurface('estimator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeSurface === 'estimator'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" /> Homeowner Estimator
            </button>

            <button
              onClick={() => setActiveSurface('owner')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeSurface === 'owner'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Owner Panel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeSurface === 'estimator' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Instant Cost Calculation Engine
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Get an Instant Cost Estimate for Your Roof
              </h1>
              <p className="text-slate-400 text-sm">
                Answer a few quick questions to receive a realistic cost estimate range backed by live materials and labor data.
              </p>
            </div>

            <EstimatorWizard />
          </div>
        )}

        {activeSurface === 'owner' && <OwnerDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Northline Roofing & Exteriors — Built for Wantace SDE Take-Home Task.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSurface('estimator')}
              className="hover:text-slate-300 transition"
            >
              Public Surface
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveSurface('owner')}
              className="hover:text-slate-300 transition"
            >
              Owner Surface
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
