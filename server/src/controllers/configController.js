import { Config } from '../models/Config.js';
import { seedData } from '../seed.js';

// In-memory fallback config state
let inMemoryConfig = { ...seedData };

/**
 * Public Endpoint GET /api/config
 * Returns active questions & business info for the Estimator wizard.
 * Zero pricing data or hardcoded questions in frontend.
 */
export async function getPublicConfig(req, res) {
  try {
    let config = null;
    try {
      config = await Config.findOne({ is_active: true }).lean();
    } catch (dbErr) {
      console.warn('Database query notice, using in-memory config:', dbErr.message);
    }

    if (!config) {
      config = inMemoryConfig;
    }

    // Filter only active questions and sort by order
    const activeQuestions = (config.questions || [])
      .filter((q) => q.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((q) => ({
        key: q.key,
        label: q.label,
        type: q.type,
        unit: q.unit || '',
        required: q.required !== false,
        min: q.min,
        max: q.max,
        options: (q.options || []).map((opt) => ({
          value: opt.value,
          label: opt.label
        }))
      }));

    return res.json({
      config_version: config.config_version || 3,
      business: config.business || inMemoryConfig.business,
      questions: activeQuestions,
      modifiers: config.modifiers || inMemoryConfig.modifiers
    });
  } catch (error) {
    console.error('Error fetching public config, delivering fallback seed data:', error);
    return res.json({
      config_version: inMemoryConfig.config_version,
      business: inMemoryConfig.business,
      questions: (inMemoryConfig.questions || []).filter((q) => q.active !== false),
      modifiers: inMemoryConfig.modifiers
    });
  }
}

/**
 * Protected Endpoint GET /api/admin/config
 * Returns complete configuration including inactive questions for Owner Panel editing.
 */
export async function getAdminConfig(req, res) {
  try {
    let config = null;
    try {
      config = await Config.findOne({ is_active: true });
    } catch (err) {
      console.warn('Admin config DB notice:', err.message);
    }

    if (!config) {
      config = inMemoryConfig;
    }
    return res.json(config);
  } catch (error) {
    console.error('Error fetching admin config:', error);
    return res.json(inMemoryConfig);
  }
}

/**
 * Protected Endpoint PUT /api/admin/config
 * Updates questions, rates, multipliers, and increments config_version.
 */
export async function updateAdminConfig(req, res) {
  try {
    const { business, questions, modifiers } = req.body;

    let config = null;
    try {
      config = await Config.findOne({ is_active: true });
    } catch (err) {
      console.warn('DB notice during updateAdminConfig:', err.message);
    }

    if (!config) {
      config = new Config(inMemoryConfig);
    }

    // Increment version
    const newVersion = (config.config_version || inMemoryConfig.config_version || 3) + 1;
    config.config_version = newVersion;

    if (business) config.business = { ...config.business, ...business };
    if (modifiers) config.modifiers = { ...config.modifiers, ...modifiers };

    if (Array.isArray(questions)) {
      config.questions = questions.map((q, idx) => ({
        key: q.key,
        label: q.label,
        type: q.type,
        unit: q.unit || '',
        required: q.required !== false,
        min: q.min !== undefined ? Number(q.min) : undefined,
        max: q.max !== undefined ? Number(q.max) : undefined,
        active: q.active !== false,
        order: q.order || idx + 1,
        options: Array.isArray(q.options)
          ? q.options.map((opt) => ({
              value: opt.value,
              label: opt.label,
              rate_per_sqft: opt.rate_per_sqft !== undefined ? Number(opt.rate_per_sqft) : 0,
              multiplier: opt.multiplier !== undefined ? (isNaN(Number(opt.multiplier)) ? opt.multiplier : Number(opt.multiplier)) : 1.0,
              tear_off_per_sqft: opt.tear_off_per_sqft !== undefined ? Number(opt.tear_off_per_sqft) : 0
            }))
          : []
      }));
    }

    // Update in-memory fallback cache
    inMemoryConfig = config.toObject ? config.toObject() : config;

    try {
      await config.save();
    } catch (saveErr) {
      console.warn('DB save warning:', saveErr.message);
    }

    console.log(`Config updated to version ${config.config_version} by admin.`);

    return res.json({
      message: 'Configuration updated successfully!',
      config: inMemoryConfig
    });
  } catch (error) {
    console.error('Error updating admin config:', error);
    return res.status(500).json({ error: 'Server error updating configuration.' });
  }
}
