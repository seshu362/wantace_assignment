import { Config } from '../models/Config.js';
import { Lead } from '../models/Lead.js';
import { calculateEstimate } from '../services/calculator.js';
import { seedData, seedLeads } from '../seed.js';

/**
 * Public Endpoint POST /api/estimate
 * Accepts customer contact info + answers.
 * Performs server-side calculation and persists Lead in DB.
 */
export async function createEstimateAndLead(req, res) {
  try {
    const { name, phone, email, answers } = req.body;

    // Contact details validation
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers payload is required.' });
    }

    // Fetch active configuration from DB or seed fallback
    let config = null;
    try {
      config = await Config.findOne({ is_active: true });
    } catch (err) {
      console.warn('DB read notice during estimate calculation:', err.message);
    }

    if (!config) {
      config = seedData;
    }

    // Calculate estimate server-side
    const calcResult = calculateEstimate(config, answers);

    if (calcResult.error) {
      return res.status(400).json({
        error: 'Validation failed for submitted answers.',
        details: calcResult.messages
      });
    }

    // Create lead record with unique ID
    const leadId = `ld_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      const newLead = new Lead({
        lead_id: leadId,
        config_version: config.config_version || 3,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        answers,
        estimate_low: calcResult.estimate_low,
        estimate_high: calcResult.estimate_high,
        captured_at: new Date()
      });
      await newLead.save();
    } catch (dbErr) {
      console.warn('Lead DB save notice:', dbErr.message);
    }

    return res.status(201).json({
      success: true,
      lead_id: leadId,
      config_version: config.config_version || 3,
      estimate_low: calcResult.estimate_low,
      estimate_high: calcResult.estimate_high,
      currency: config.business?.currency || 'USD',
      breakdown: calcResult.breakdown
    });
  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({ error: 'Server error processing estimate.' });
  }
}

/**
 * Protected Endpoint GET /api/admin/leads
 * Returns captured leads for Owner Panel dashboard.
 */
export async function getAdminLeads(req, res) {
  try {
    let leads = [];
    try {
      leads = await Lead.find({}).sort({ captured_at: -1 }).lean();
    } catch (err) {
      console.warn('DB leads read notice:', err.message);
    }

    if (!leads || leads.length === 0) {
      leads = seedLeads;
    }
    return res.json(leads);
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    return res.json(seedLeads);
  }
}
