/**
 * Calculator logic engine for Northline Roofing & Exteriors
 * Computes deterministic E_low and E_high server-side based on active config.
 */

export function calculateEstimate(config, answers) {
  const { questions = [], modifiers = {} } = config;

  // Helper to extract numeric value safely even if passed as string float
  const safeNumber = (val, fallback = 0) => {
    if (val === undefined || val === null || val === '') return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  // Find active question by key
  const getQuestion = (key) => questions.find((q) => q.key === key && q.active !== false);

  // Validate required questions
  const activeQuestions = questions.filter((q) => q.active !== false);
  const errors = [];

  for (const q of activeQuestions) {
    if (q.required && (answers[q.key] === undefined || answers[q.key] === null || answers[q.key] === '')) {
      errors.push(`Answer for '${q.label}' is required.`);
      continue;
    }

    if (q.type === 'number') {
      const numVal = safeNumber(answers[q.key]);
      if (q.min !== undefined && numVal < q.min) {
        errors.push(`'${q.label}' must be at least ${q.min} ${q.unit || ''}.`);
      }
      if (q.max !== undefined && numVal > q.max) {
        errors.push(`'${q.label}' cannot exceed ${q.max} ${q.unit || ''}.`);
      }
    }
  }

  if (errors.length > 0) {
    return { error: true, messages: errors };
  }

  // Extract inputs
  const roofArea = safeNumber(answers['roof_area'], 0);

  // Find selected option helper
  const getSelectedOption = (questionKey) => {
    const q = getQuestion(questionKey);
    if (!q || !Array.isArray(q.options)) return null;
    const selectedValue = answers[questionKey];
    return q.options.find((opt) => String(opt.value) === String(selectedValue)) || null;
  };

  const materialOpt = getSelectedOption('material');
  const pitchOpt = getSelectedOption('pitch');
  const layersOpt = getSelectedOption('layers');
  const storiesOpt = getSelectedOption('stories');

  // Extract rates & multipliers safely
  const ratePerSqft = safeNumber(materialOpt?.rate_per_sqft, 0);
  const pitchMult = safeNumber(pitchOpt?.multiplier, 1.0);
  const tearOffPerSqft = safeNumber(layersOpt?.tear_off_per_sqft, 0);
  const storiesMult = safeNumber(storiesOpt?.multiplier, 1.0);

  // Modifiers
  const wasteFactor = safeNumber(modifiers.waste_factor, 0.10);
  const permitFee = safeNumber(modifiers.permit_flat_fee, 350);
  const rangeSpreadRaw = safeNumber(modifiers.range_spread_pct, 12);
  const spreadPct = rangeSpreadRaw > 1 ? rangeSpreadRaw / 100 : rangeSpreadRaw;

  // Formula Calculations
  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const subtotal = (baseMaterialCost + tearOffCost) * pitchMult * storiesMult;
  const midPointEstimate = subtotal + permitFee;

  const estimateLow = Math.round(midPointEstimate * (1 - spreadPct));
  const estimateHigh = Math.round(midPointEstimate * (1 + spreadPct));

  return {
    error: false,
    estimate_low: estimateLow,
    estimate_high: estimateHigh,
    breakdown: {
      roof_area: roofArea,
      rate_per_sqft: ratePerSqft,
      base_material_cost: Math.round(baseMaterialCost),
      tear_off_cost: Math.round(tearOffCost),
      pitch_multiplier: pitchMult,
      stories_multiplier: storiesMult,
      subtotal: Math.round(subtotal),
      permit_fee: permitFee,
      midpoint: Math.round(midPointEstimate)
    }
  };
}
