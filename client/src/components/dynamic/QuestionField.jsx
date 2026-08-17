import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function QuestionField({ question, value, onChange, error }) {
  if (!question || question.active === false) return null;

  if (question.type === 'number') {
    const numVal = value !== undefined && value !== null ? value : '';
    return (
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-white">
          {question.label}
          {question.unit ? <span className="ml-2 text-sm font-normal text-sky-400">({question.unit})</span> : ''}
        </label>

        <div className="relative">
          <input
            type="number"
            min={question.min}
            max={question.max}
            value={numVal}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Number(e.target.value);
              onChange(question.key, val);
            }}
            placeholder={`Enter square footage (${question.min || 300} - ${question.max || 12000})`}
            className={`w-full px-5 py-4 bg-slate-900/90 border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
            } rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 transition`}
            required={question.required}
          />
          {question.unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              {question.unit}
            </span>
          )}
        </div>

        {/* Visual range indicator helper */}
        {(question.min !== undefined || question.max !== undefined) && (
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>Min: {question.min?.toLocaleString()} {question.unit}</span>
            <span>Max: {question.max?.toLocaleString()} {question.unit}</span>
          </div>
        )}

        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  }

  if (question.type === 'select') {
    return (
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-white">
          {question.label}
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options?.map((opt) => {
            const isSelected = String(value) === String(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => onChange(question.key, opt.value)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-950/50 ring-1 ring-sky-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-sky-400 bg-sky-500' : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                  </div>
                  <span className="font-medium text-base">{opt.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  }

  return null;
}
