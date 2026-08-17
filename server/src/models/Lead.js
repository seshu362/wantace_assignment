import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  lead_id: { type: String, required: true, unique: true },
  config_version: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  answers: { type: mongoose.Schema.Types.Mixed, required: true },
  estimate_low: { type: Number, required: true },
  estimate_high: { type: Number, required: true },
  captured_at: { type: Date, default: Date.now }
}, { timestamps: true });

export const Lead = mongoose.model('Lead', LeadSchema);
