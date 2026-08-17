import React, { useState, useEffect } from 'react';
import QuestionField from '../dynamic/QuestionField';
import { fetchPublicConfig, submitEstimate } from '../../services/api';
import { ShieldCheck, ArrowRight, ArrowLeft, Calculator, Sparkles, Phone, Mail, User, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function EstimatorWizard() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [stepErrors, setStepErrors] = useState({});

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicConfig();
      setConfig(data);
    } catch (err) {
      setError(err.message || 'Failed to load calculation rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStepErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    setStepErrors((prev) => ({ ...prev, [field]: null }));
  };

  const activeQuestions = config?.questions || [];
  const totalSteps = activeQuestions.length + 1; // Questions + Contact Step

  const validateCurrentStep = () => {
    // Question Step Validation
    if (currentStepIndex < activeQuestions.length) {
      const q = activeQuestions[currentStepIndex];
      const val = answers[q.key];

      if (q.required && (val === undefined || val === null || val === '')) {
        setStepErrors({ [q.key]: `Please answer this question to proceed.` });
        return false;
      }

      if (q.type === 'number') {
        const num = Number(val);
        if (isNaN(num)) {
          setStepErrors({ [q.key]: `Please enter a valid number.` });
          return false;
        }
        if (q.min !== undefined && num < q.min) {
          setStepErrors({ [q.key]: `Minimum size is ${q.min} ${q.unit || ''}.` });
          return false;
        }
        if (q.max !== undefined && num > q.max) {
          setStepErrors({ [q.key]: `Maximum size is ${q.max} ${q.unit || ''}.` });
          return false;
        }
      }
    }

    // Contact Step Validation
    if (currentStepIndex === activeQuestions.length) {
      const errors = {};
      if (!contact.name.trim()) errors.name = 'Full name is required.';
      if (!contact.phone.trim()) errors.phone = 'Phone number is required.';
      if (!contact.email.trim() || !contact.email.includes('@')) errors.email = 'Valid email is required.';

      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStepIndex < activeQuestions.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        answers
      };
      const res = await submitEstimate(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate estimate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAnswers({});
    setContact({ name: '', phone: '', email: '' });
    setCurrentStepIndex(0);
    setStepErrors({});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 text-center">
        <RefreshCw className="w-10 h-10 text-sky-400 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-white">Fetching Live Pricing Rules...</h3>
        <p className="text-slate-400 text-sm mt-1">Connecting to Northline database</p>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="p-8 rounded-2xl glass-card border-red-500/40 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Unable to Connect</h3>
        <p className="text-slate-300 mb-6">{error}</p>
        <button
          onClick={loadConfig}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Result Screen
  if (result) {
    const currencySymbol = result.currency === 'USD' ? '$' : result.currency;
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8 border border-sky-500/30 shadow-2xl shadow-sky-950/40">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl mb-4 border border-emerald-500/30">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="block text-xs uppercase tracking-wider text-sky-400 font-bold mb-1">
            Estimate Calculated Server-Side
          </span>
          <h2 className="text-3xl font-extrabold text-white">Your Roofing Estimate Range</h2>
          <p className="text-slate-400 text-sm mt-1">Prepared for {contact.name} ({config?.business?.name})</p>
        </div>

        {/* Price Range Display */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 rounded-2xl p-8 border border-sky-500/40 text-center my-6 shadow-inner">
          <p className="text-sm font-medium text-slate-300 mb-1">Estimated Total Cost</p>
          <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
            <span className="text-sky-400">{currencySymbol}{result.estimate_low?.toLocaleString()}</span>
            <span className="text-slate-500 mx-3">-</span>
            <span className="text-sky-400">{currencySymbol}{result.estimate_high?.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Includes estimated materials, labor, tear-off, and local municipal permit fees.
          </p>
        </div>

        {/* Cost Breakdown Details */}
        {result.breakdown && (
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 space-y-2 mb-8 text-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">
              Calculation Summary
            </h4>
            <div className="flex justify-between text-slate-300">
              <span>Roof Size:</span>
              <span className="font-semibold text-white">{result.breakdown.roof_area?.toLocaleString()} sq ft</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Base Material Cost:</span>
              <span className="font-semibold text-white">{currencySymbol}{result.breakdown.base_material_cost?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tear-Off Cost:</span>
              <span className="font-semibold text-white">{currencySymbol}{result.breakdown.tear_off_cost?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Pitch & Multipliers:</span>
              <span className="font-semibold text-white">x{result.breakdown.pitch_multiplier} / x{result.breakdown.stories_multiplier}</span>
            </div>
            <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
              <span>Flat Permit Fee:</span>
              <span className="font-semibold text-white">{currencySymbol}{result.breakdown.permit_fee}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3.5 px-6 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Start New Estimate
          </button>
          <a
            href={`tel:${config?.business?.phone || '6145550100'}`}
            className="flex-1 py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition text-center shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Book Inspection Call
          </a>
        </div>
      </div>
    );
  }

  const isContactStep = currentStepIndex === activeQuestions.length;
  const currentQuestion = activeQuestions[currentStepIndex];
  const progressPct = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span className="uppercase tracking-wider">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span className="text-sky-400">{progressPct}% Completed</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="min-h-[220px]">
        {!isContactStep && currentQuestion && (
          <QuestionField
            question={currentQuestion}
            value={answers[currentQuestion.key]}
            onChange={handleAnswerChange}
            error={stepErrors[currentQuestion.key]}
          />
        )}

        {isContactStep && (
          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Final Step: Where should we send your estimate?</h3>
              <p className="text-slate-400 text-sm">Enter your contact details to instantly unlock your price range.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    placeholder="e.g. Dale Whitmore"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                {stepErrors.name && <p className="text-xs text-red-400 mt-1">{stepErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="e.g. +1-614-555-0199"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                {stepErrors.phone && <p className="text-xs text-red-400 mt-1">{stepErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="e.g. dale@northlineroofing.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
                {stepErrors.email && <p className="text-xs text-red-400 mt-1">{stepErrors.email}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800/80">
        <button
          onClick={handleBack}
          disabled={currentStepIndex === 0 || submitting}
          className={`px-5 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
            currentStepIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-600'
              : 'text-slate-300 bg-slate-900 hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={handleNext}
          disabled={submitting}
          className="px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition shadow-lg shadow-sky-600/30 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Calculating...
            </>
          ) : isContactStep ? (
            <>
              Get Estimate <Sparkles className="w-4 h-4" />
            </>
          ) : (
            <>
              Next Step <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
